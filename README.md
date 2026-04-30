# kintscher.ai

Personal site of Yannik Kintscher — fullstack engineer in Zürich, working on GenAI and conversational banking at UBS.

Live: **[kintscher.ai](https://kintscher.ai)**

## Highlights

- **Ask Yannik** — a streaming chatbot at [`/chat`](https://kintscher.ai/chat) backed by Claude Haiku 4.5. Demonstrates the kind of work I do day-to-day: turning a system prompt, a stream, and a few production constraints into something that actually feels good to use.
- **Edge-native** — runs on Cloudflare Workers. Rate limiting via Workers KV (40/hour, 150/day per IP), aborts propagated end-to-end so cancelled requests don't burn API credits.
- **Static-first** — every page is prerendered and works without JavaScript. Lighthouse target is 100/100/100/100.
- **Minimal client JS** — interactive bits are Astro islands hydrated `client:visible`; navigation uses View Transitions.

## Stack

| Layer       | Choice                                          |
| :---------- | :---------------------------------------------- |
| Framework   | [Astro 6](https://astro.build) (prerendered)    |
| Styles      | Tailwind CSS v4                                 |
| Runtime     | Cloudflare Workers (`@astrojs/cloudflare`)      |
| State       | Workers KV (chat rate limiting)                 |
| AI          | Anthropic SDK · `claude-haiku-4-5`              |
| Fonts       | JetBrains Mono, Inter                           |

## Pages

Five routes, all reachable from the home page in one click: `/`, `/about`, `/chat`, `/contact`, and a 404.

## Local development

Requires Node ≥ 22.12 and pnpm.

| Command         | Action                                      |
| :-------------- | :------------------------------------------ |
| `pnpm install`  | Install dependencies                        |
| `pnpm dev`      | Dev server at `localhost:4321`              |
| `pnpm build`    | Build to `./dist/`                          |
| `pnpm preview`  | Preview production build via Wrangler       |
| `pnpm deploy`   | Build and deploy to Cloudflare Workers      |

The chat endpoint needs an `ANTHROPIC_API_KEY` Wrangler secret and a `CHAT_RATE_LIMIT` KV namespace (see `wrangler.jsonc`). Without these, `/chat` returns 500 but the rest of the site works fine.

## Deploy

Authenticated Wrangler CLI required (`pnpm wrangler login`).

```sh
pnpm deploy                         # build + deploy to production
pnpm wrangler versions upload       # upload without routing traffic (returns preview URL)
pnpm wrangler versions deploy       # route traffic to an uploaded version (gradual rollouts)
pnpm wrangler versions list         # list uploaded versions
pnpm wrangler rollback              # revert to the previous version
```

## Project layout

```
src/
├── pages/          # Astro routes (index, about, chat, contact, 404)
│   └── api/chat.ts # Streaming Claude endpoint with KV rate limiting
├── components/     # ChatInterface, CommandPalette, SiteHeader, …
├── prompts/        # System prompt for Ask Yannik
├── layouts/
├── styles/
└── assets/
```

## Contact

- Email — yannik@kintscher.ai
- GitHub — [@kintscher](https://github.com/kintscher)
- LinkedIn — [yannik-kintscher](https://www.linkedin.com/in/yannik-kintscher/)
