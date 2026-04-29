# kintscher.ai

Personal landing page. Built with [Astro](https://astro.build) and deployed on Cloudflare Workers.

## Pages

Five routes, all reachable from the home page in one click:
`/`, `/about`, `/chat`, `/contact`, and a 404.

## Stack

- **Framework:** Astro (prerendered, minimal client JS)
- **Styles:** Tailwind CSS v4
- **Adapter:** `@astrojs/cloudflare`
- **Fonts:** JetBrains Mono, Inter (via Google Fonts)

## Commands

| Command         | Action                                      |
| :-------------- | :------------------------------------------ |
| `pnpm install`  | Install dependencies                        |
| `pnpm dev`      | Start local dev server at `localhost:4321`  |
| `pnpm build`    | Build to `./dist/`                          |
| `pnpm preview`  | Preview build locally with Wrangler         |
| `pnpm deploy`   | Deploy to Cloudflare Workers                |

## Deploy

Deployed via Cloudflare Workers. Requires a `wrangler.jsonc` with the correct account and worker name.
