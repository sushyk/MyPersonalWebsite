// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages project site: https://sushyk.github.io/MyPersonalWebsite/
// If a custom domain is added later, set `site` to it and remove `base`.
export default defineConfig({
  site: 'https://sushyk.github.io',
  base: '/MyPersonalWebsite',
  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },
});
