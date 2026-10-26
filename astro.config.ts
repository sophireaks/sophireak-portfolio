import { defineConfig } from 'astro/config';
import { securityHeaders } from './integrations/security-headers';

// Set the real production URL before deploying. It is used for canonical links and the sitemap.
const SITE = 'https://sophireaks.github.io';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  build: {
    // Keep every script and stylesheet as an external file so the CSP needs no inline allowances.
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
  integrations: [securityHeaders()],
});
