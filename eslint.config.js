import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default [
  { ignores: ['dist/', '.astro/', 'node_modules/', 'public/early.js'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    rules: {
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-restricted-properties': [
        'error',
        {
          property: 'innerHTML',
          message: 'Use textContent or DOM APIs. innerHTML is an XSS sink.',
        },
        {
          property: 'outerHTML',
          message: 'Use DOM APIs. outerHTML is an XSS sink.',
        },
        {
          property: 'insertAdjacentHTML',
          message: 'Use DOM APIs. insertAdjacentHTML is an XSS sink.',
        },
      ],
      '@typescript-eslint/no-non-null-assertion': 'error',
    },
  },
  {
    files: ['scripts/**/*.mjs', 'integrations/**/*.ts', 'astro.config.ts'],
    languageOptions: { globals: { process: 'readonly', console: 'readonly', URL: 'readonly' } },
  },
  {
    files: ['public/**/*.js', 'scripts/**/*.mjs'],
    languageOptions: {
      globals: { document: 'readonly', localStorage: 'readonly', setTimeout: 'readonly' },
    },
  },
];
