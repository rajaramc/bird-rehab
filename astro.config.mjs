import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  // update when deployed
  site: 'https://example.pages.dev',

  adapter: cloudflare()
});