import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import Anthropic from '@anthropic-ai/sdk';
import systemPrompt from '../../prompts/ask-yannik.md?raw';

export const prerender = false;

const HOUR_SECONDS = 3600;
const DAY_SECONDS = 86400;
const HOUR_LIMIT = 40;
const DAY_LIMIT = 150;

const MAX_MESSAGES = 30;
const MAX_MESSAGE_CHARS = 4000;
const MAX_TOTAL_CHARS = 50000;
const MAX_TOKENS = 1024;

type ChatMessage = { role: 'user' | 'assistant'; content: string };
type RateBucket = { count: number; exp: number };

// ANTHROPIC_API_KEY is a wrangler secret — not declared in wrangler.jsonc, so
// it doesn't appear on the generated Env type. Cast at the access site.
type ChatEnv = Env & { ANTHROPIC_API_KEY?: string };

function getClientIP(req: Request): string {
  return (
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

async function readBucket(
  kv: KVNamespace,
  key: string,
  now: number,
  windowSec: number,
): Promise<RateBucket> {
  const raw = await kv.get(key);
  if (!raw) return { count: 0, exp: now + windowSec };
  try {
    const parsed = JSON.parse(raw) as RateBucket;
    if (
      typeof parsed.count !== 'number' ||
      typeof parsed.exp !== 'number' ||
      parsed.exp <= now
    ) {
      return { count: 0, exp: now + windowSec };
    }
    return parsed;
  } catch {
    return { count: 0, exp: now + windowSec };
  }
}

async function checkAndIncrementLimits(
  kv: KVNamespace,
  ip: string,
): Promise<{ ok: true } | { ok: false; retryAfter: number }> {
  const now = Math.floor(Date.now() / 1000);
  const hourKey = `rl:hour:${ip}`;
  const dayKey = `rl:day:${ip}`;

  const [hour, day] = await Promise.all([
    readBucket(kv, hourKey, now, HOUR_SECONDS),
    readBucket(kv, dayKey, now, DAY_SECONDS),
  ]);

  if (hour.count >= HOUR_LIMIT || day.count >= DAY_LIMIT) {
    const remainingHour =
      hour.count >= HOUR_LIMIT ? hour.exp - now : Number.POSITIVE_INFINITY;
    const remainingDay =
      day.count >= DAY_LIMIT ? day.exp - now : Number.POSITIVE_INFINITY;
    const retryAfter = Math.max(
      1,
      Math.ceil(Math.min(remainingHour, remainingDay)),
    );
    return { ok: false, retryAfter };
  }

  // Increment BEFORE calling Anthropic. Aborted requests still count —
  // otherwise an attacker who cancels every fetch gets unlimited free calls
  // to our key.
  hour.count += 1;
  day.count += 1;

  await Promise.all([
    kv.put(hourKey, JSON.stringify(hour), { expiration: hour.exp }),
    kv.put(dayKey, JSON.stringify(day), { expiration: day.exp }),
  ]);

  return { ok: true };
}

function validate(body: unknown): ChatMessage[] | string {
  if (!body || typeof body !== 'object') return 'invalid body';
  const messages = (body as { messages?: unknown }).messages;
  if (!Array.isArray(messages) || messages.length === 0) return 'messages required';
  if (messages.length > MAX_MESSAGES) return 'too many messages';

  let total = 0;
  const out: ChatMessage[] = [];
  for (const m of messages) {
    if (!m || typeof m !== 'object') return 'invalid message';
    const { role, content } = m as { role?: unknown; content?: unknown };
    if (role !== 'user' && role !== 'assistant') return 'invalid role';
    if (typeof content !== 'string') return 'content must be string';
    if (content.length === 0) return 'empty message';
    if (content.length > MAX_MESSAGE_CHARS) return 'message too long';
    total += content.length;
    if (total > MAX_TOTAL_CHARS) return 'conversation too long';
    out.push({ role, content });
  }

  if (out[out.length - 1].role !== 'user') return 'last message must be user';
  return out;
}

export const POST: APIRoute = async ({ request }) => {
  const cfEnv = env as ChatEnv;

  if (!cfEnv.ANTHROPIC_API_KEY) {
    console.error('chat: ANTHROPIC_API_KEY missing');
    return new Response('server misconfigured', { status: 500 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response('invalid json', { status: 400 });
  }

  const validated = validate(body);
  if (typeof validated === 'string') {
    return new Response(validated, { status: 400 });
  }

  const ip = getClientIP(request);
  const limit = await checkAndIncrementLimits(cfEnv.CHAT_RATE_LIMIT, ip);
  if (!limit.ok) {
    return new Response('rate limited', {
      status: 429,
      headers: { 'Retry-After': String(limit.retryAfter) },
    });
  }

  const client = new Anthropic({ apiKey: cfEnv.ANTHROPIC_API_KEY });
  const encoder = new TextEncoder();

  let apiStream: ReturnType<typeof client.messages.stream> | null = null;

  const responseStream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;
      const close = () => {
        if (closed) return;
        closed = true;
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };

      try {
        apiStream = client.messages.stream(
          {
            model: 'claude-haiku-4-5',
            max_tokens: MAX_TOKENS,
            system: systemPrompt,
            messages: validated,
          },
          { signal: request.signal },
        );

        apiStream.on('text', (delta: string) => {
          if (closed) return;
          try {
            controller.enqueue(encoder.encode(delta));
          } catch {
            closed = true;
          }
        });

        await apiStream.finalMessage();
      } catch (err: unknown) {
        const e = err as {
          status?: number;
          message?: string;
          request_id?: string;
          name?: string;
        };
        if (e?.name !== 'AbortError') {
          console.error('chat stream error', {
            status: e?.status,
            message: e?.message,
            request_id: e?.request_id,
          });
        }
      } finally {
        close();
      }
    },
    cancel() {
      try {
        apiStream?.controller?.abort();
      } catch {
        /* ignore */
      }
    },
  });

  return new Response(responseStream, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
};
