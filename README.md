# Sophireak Soeng, portfolio

Software engineer and security researcher portfolio. Astro (static), strict
TypeScript, GSAP animations, self-hosted fonts, strict CSP.

## Quick start

```bash
nvm use            # Node 22.23.4 (.nvmrc)
npm ci
npm run dev        # http://localhost:4321
npm run verify     # format, lint, typecheck, tests, build, dist guard
```

## Structure

```
src/
  data/site.ts            personal info, links, marquee, services (edit this)
  content/projects/*.md   one file per project (frontmatter + case study)
  content.config.ts       zod schema for projects
  components/             Hero, Works, About, Services, Contact, mocks/
  layouts/Base.astro      head, CSP meta, nav, footer
  pages/                  index, projects/, 404
  scripts/                GSAP modules (hero, gallery, reveal, theme, menu)
  lib/                    pure, tested helpers (security, themes, math, dom)
  styles/                 tokens.css (themes), global.css
integrations/             Astro integration that writes dist/_headers
scripts/check-dist.mjs    post-build security guard
tests/                    Vitest unit tests
public/                   early.js (pre-paint theme), robots.txt, favicon
```

## Make it yours

1. `src/data/site.ts`: set `email` (empty hides email links), links, text.
2. `astro.config.ts`: replace the placeholder `site` URL with your real one.
3. `src/content/projects/*.md`: add `repo` / `demo` URLs and real details.
   Project descriptions are intentionally minimal; expand them with facts.
4. The windows in the project carousel are illustrative mocks, not
   screenshots. Replace them with real screenshots when you have them.

## Deploy

Run `npm run build` and publish `dist/`. Cloudflare Pages or Netlify apply
`dist/_headers` (full security headers). GitHub Pages works but only gets the
meta CSP. See `SECURITY.md`.

## Quality gates

CI (`.github/workflows/ci.yml`) runs the same checks as `npm run verify`
plus `npm audit` on production dependencies.

## License

MIT
