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

Deployed via Cloudflare Workers using Wrangler. Requires an authenticated Wrangler CLI (`pnpm wrangler login`) and a configured `wrangler.jsonc`.

```sh
pnpm build                          # build to ./dist/
pnpm preview                        # preview production build at localhost:8787
pnpm deploy                         # deploy directly to production
pnpm wrangler versions upload       # upload a new version without routing traffic (returns preview URL)
pnpm wrangler versions deploy       # route traffic to an uploaded version (supports gradual rollouts)
pnpm wrangler versions list         # list all uploaded versions
pnpm wrangler rollback              # revert to the previous deployed version
```
