# kintscher.ai

Personal landing page. Built with [Astro](https://astro.build) and deployed on Cloudflare Workers.

## Stack

- **Framework:** Astro (static, zero client-side JS)
- **Styles:** Tailwind CSS v4
- **Adapter:** `@astrojs/cloudflare`
- **Fonts:** JetBrains Mono, Inter (via Google Fonts)

## Project Structure

```
/
├── public/
│   └── favicon.svg
├── src/
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
└── wrangler.jsonc
```

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
