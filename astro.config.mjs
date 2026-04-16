import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kintscher.ai',
  integrations: [sitemap()],
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()],
  },
});