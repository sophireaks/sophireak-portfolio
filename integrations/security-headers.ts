import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { renderHeadersFile } from '../src/lib/security';

/** Writes dist/_headers from the shared policy so the meta tag and real headers never drift. */
export function securityHeaders(): AstroIntegration {
  return {
    name: 'security-headers',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const target = fileURLToPath(new URL('_headers', dir));
        await writeFile(target, renderHeadersFile(), 'utf8');
      },
    },
  };
}
