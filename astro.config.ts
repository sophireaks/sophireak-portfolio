import { defineConfig } from 'astro/config';
import { securityHeaders } from './integrations/security-headers';

const SITE = 'https://sophireaksoeng.dev';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  build: {
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
  integrations: [securityHeaders()],
});
