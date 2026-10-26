// Post-build guard. Fails the build if the output could not satisfy the strict CSP
// or contains patterns that weaken it.
import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const problems = [];

async function walk(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    const full = join(dir, name);
    const info = await stat(full);
    if (info.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const files = await walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
if (htmlFiles.length === 0) problems.push('No HTML files found in dist/. Did the build run?');

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const rel = file.slice(DIST.length);

  for (const match of html.matchAll(/<script\b([^>]*)>/gi)) {
    const attrs = match[1] ?? '';
    if (!/\bsrc\s*=/.test(attrs)) problems.push(`${rel}: inline <script> found`);
    const src = /\bsrc\s*=\s*["']([^"']+)["']/.exec(attrs)?.[1];
    if (src !== undefined && /^(https?:)?\/\//.test(src))
      problems.push(`${rel}: remote script ${src}`);
  }
  if (/<style\b/i.test(html)) problems.push(`${rel}: inline <style> element found`);
  if (/\sstyle\s*=/i.test(html)) problems.push(`${rel}: inline style="" attribute found`);
  if (/\son[a-z]+\s*=/i.test(html)) problems.push(`${rel}: inline event handler attribute found`);
  if (/javascript:/i.test(html)) problems.push(`${rel}: javascript: URL found`);
  if (!/http-equiv="Content-Security-Policy"/i.test(html))
    problems.push(`${rel}: CSP meta tag missing`);

  for (const match of html.matchAll(/<link\b([^>]*)>/gi)) {
    const href = /\bhref\s*=\s*["']([^"']+)["']/.exec(match[1] ?? '')?.[1];
    if (
      href !== undefined &&
      /^(https?:)?\/\//.test(href) &&
      !/rel="canonical"/.test(match[1] ?? '')
    ) {
      problems.push(`${rel}: remote <link> ${href}`);
    }
  }
  for (const match of html.matchAll(/<a\b([^>]*)>/gi)) {
    const attrs = match[1] ?? '';
    if (/target="_blank"/.test(attrs) && !/rel="[^"]*noopener[^"]*"/.test(attrs)) {
      problems.push(`${rel}: target=_blank link without rel=noopener`);
    }
  }
}

for (const file of files.filter((f) => f.endsWith('.css'))) {
  const css = await readFile(file, 'utf8');
  if (/url\(\s*["']?(https?:)?\/\//.test(css))
    problems.push(`${file.slice(DIST.length)}: remote url() in CSS`);
}

const headers = files.find((f) => f.endsWith('/_headers'));
if (headers === undefined) problems.push('dist/_headers is missing');

if (problems.length > 0) {
  console.error('dist check failed:');
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`dist check passed (${htmlFiles.length} pages, ${files.length} files).`);
