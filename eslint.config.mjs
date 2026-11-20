import tsParser from '@typescript-eslint/parser'
import * as astroParser from 'astro-eslint-parser'
import betterTailwindcss from 'eslint-plugin-better-tailwindcss'
import reactHooks from 'eslint-plugin-react-hooks'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', '.astro', 'node_modules']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'prefer-const': 'off',
    },
  },
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.astro'],
      },
    },
  },
  {
    files: ['**/*.{ts,tsx,astro}'],
    extends: [betterTailwindcss.configs.recommended],
    settings: {
      'better-tailwindcss': {
        entryPoint: 'src/styles/global.css',
        tsconfig: 'tsconfig.json',
        detectComponentClasses: true,
        selectors: {
          extends: [
            {
              kind: 'callee',
              name: '^cns$',
              match: [{ type: 'strings' }, { type: 'objectKeys' }],
            },
          ],
        },
      },
    },
    rules: {
      'better-tailwindcss/enforce-consistent-line-wrapping': [
        'warn',
        { printWidth: 80, strictness: 'loose' },
      ],
      'better-tailwindcss/enforce-canonical-classes': 'off',
      'better-tailwindcss/no-unknown-classes': [
        'error',
        { ignore: ['^skip-link$'] },
      ],
      'better-tailwindcss/enforce-consistent-variable-syntax': 'warn',
      'better-tailwindcss/enforce-consistent-important-position': 'warn',
      'better-tailwindcss/enforce-shorthand-classes': 'warn',
    },
  },
])
