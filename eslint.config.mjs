import tsParser from '@typescript-eslint/parser'
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
])
