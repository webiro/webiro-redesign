import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import svelte from '@astrojs/svelte';
import path from 'node:path';

export default defineConfig({
  site: 'https://webiro.github.io',
  base: '/webiro-redesign',
  integrations: [tailwind(), svelte()],
  vite: {
    resolve: {
      alias: {
        '@layouts': path.resolve('./src/layouts'),
      },
    },
  },
});