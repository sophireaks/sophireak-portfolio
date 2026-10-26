<div align="center">

# Sophireak Soeng

**Software engineer and security researcher. Portfolio site.**

[![CI](https://github.com/sophireaks/sophireak-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/sophireaks/sophireak-portfolio/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[Live site](https://YOUR-SITE.pages.dev) · [GitHub](https://github.com/sophireaks) · [LinkedIn](https://www.linkedin.com/in/sophireak-soeng-10b668265/) · [TryHackMe](https://tryhackme.com/p/Sophireak.S)

</div>

<!-- Add screenshots to docs/ then uncomment:
<p align="center">
  <img src="docs/hero.png" width="49%" alt="Home page" />
  <img src="docs/projects.png" width="49%" alt="Project carousel" />
</p>
-->

## Overview

A static portfolio built to the standard I would expect from production code:
typed, tested, linted, checked in CI, and served under a strict Content
Security Policy with no third-party requests.

It is also a statement of how I work. I am building a career in offensive
security, so I held my own site to the standard I would test others against.

## Contents

- [Security model](#security-model)
- [Architecture](#architecture)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Quality gates](#quality-gates)
- [Deployment](#deployment)
- [Design decisions](#design-decisions)
- [Customizing](#customizing)

## Security model

A static site has no server code, database, forms or user input, which removes
most of the attack surface. What remains is the browser side, and that is
locked down.

| Control                 | Implementation                                                                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Content Security Policy | `default-src 'none'`; scripts, styles, fonts, images, connections `'self'` only. No `unsafe-inline` or `unsafe-eval` for scripts.                      |
| Inline style attributes | Allowed only by sha256 hash (`'unsafe-hashes'`), for the two cases created by SplitType.                                                               |
| Response headers        | nosniff, Referrer-Policy, Permissions-Policy, COOP, CORP, HSTS, X-Frame-Options, `frame-ancestors 'none'`.                                             |
| Third parties           | None. Fonts and libraries are bundled and self-hosted.                                                                                                 |
| Build guard             | `scripts/check-dist.mjs` fails the build on inline scripts or handlers, remote scripts or links, missing CSP, or `target="_blank"` without `noopener`. |
| Code rules              | ESLint forbids `innerHTML`, `outerHTML`, `insertAdjacentHTML` and `eval`.                                                                              |
| Supply chain            | Lockfile committed, `npm ci --ignore-scripts` in CI, `npm audit` on production dependencies, weekly Dependabot.                                        |

The policy has a single source of truth in `src/lib/security.ts`. It is
rendered into a `<meta>` tag and into `dist/_headers`, and unit tests assert
its contents. See [SECURITY.md](SECURITY.md) for reporting and limits.

## Architecture

```
src/
  data/site.ts             personal info, links, services
  content/projects/*.md    one file per project (typed frontmatter + case study)
  content.config.ts        zod schema for the projects collection
  components/              Hero, Works, About, Services, Contact, mocks/
  layouts/Base.astro       head, CSP meta, navigation, footer
  pages/                   index, projects/, 404
  scripts/                 GSAP modules: hero, gallery, reveal, theme, menu
  lib/                     pure, tested helpers: security, themes, math, dom
  styles/                  tokens.css (themes), global.css
integrations/              Astro integration that writes dist/_headers
scripts/check-dist.mjs     post-build security guard
tests/                     Vitest unit tests
public/                    early.js (pre-paint theme), robots.txt, favicon
```

**Stack:** Astro (static output), strict TypeScript, GSAP, Vitest, ESLint,
Prettier.

## Getting started

Requires Node 22.23.4 or newer (see `.nvmrc`).

```bash
npm ci
npm run dev
```

Open http://localhost:4321. The dev server skips the CSP meta tag because it
injects inline styles; the policy applies to production builds.

## Scripts

| Command              | Purpose                                                |
| -------------------- | ------------------------------------------------------ |
| `npm run dev`        | Start the dev server                                   |
| `npm run build`      | Build to `dist/` and write `dist/_headers`             |
| `npm run preview`    | Serve the production build locally                     |
| `npm run check`      | Type check Astro and TypeScript                        |
| `npm run lint`       | ESLint                                                 |
| `npm run format`     | Prettier (write)                                       |
| `npm run test`       | Vitest unit tests                                      |
| `npm run check:dist` | Security guard on the built output                     |
| `npm run audit:prod` | `npm audit` for production dependencies                |
| `npm run verify`     | Format check, lint, types, tests, build and dist guard |

## Quality gates

Every push and pull request runs `.github/workflows/ci.yml`: format check,
lint, type check, unit tests, build, dist guard and `npm audit`. A change that
weakens the CSP or ships an inline script fails the pipeline.

## Deployment

Build with `npm run build` and publish `dist/`.

- **Cloudflare Pages or Netlify (recommended):** apply `dist/_headers`, so the
  full header set is served.
- **GitHub Pages:** works, but cannot send custom headers, so only the meta
  CSP applies.

## Design decisions

- **Progressive enhancement.** The base page is a plain, readable document.
  JavaScript adds the animations, the pinned 3D carousel and theme switching.
  With scripts disabled the content is still fully available.
- **No inline anything.** An external `early.js` sets the saved theme before
  first paint, which avoids a flash without inline scripts.
- **Themes as tokens.** Colors are registered CSS custom properties, so theme
  changes transition smoothly with no JavaScript color math.
- **Reduced motion.** Animations are skipped when the user prefers reduced
  motion, and a failsafe reveals content if scripts stall.

## Customizing

1. Edit `src/data/site.ts` for your details. An empty `email` hides email links.
2. Add or edit projects in `src/content/projects/`.
3. Set the real `site` URL in `astro.config.ts`.

## License

[MIT](LICENSE) © 2026 Sophireak Soeng