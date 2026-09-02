// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'
import legacy from '@vitejs/plugin-legacy'
import { twMergeConfig } from './scripts/vite-plugin-tw-merge.mjs'

const buildRev = new Date().toISOString().slice(0, 10).replace(/-/g, '.')

// https://astro.build/config
export default defineConfig({
  site: 'https://bobunderforest.me',
  integrations: [react()],

  build: {
    assets: '_assets',
  },

  vite: {
    define: {
      __BUILD_REV__: JSON.stringify(buildRev),
    },
    plugins: [
      twMergeConfig(),
      tailwindcss(),
      svgr(),
      legacy({
        targets: [
          'android >= 9',
          'ios >= 12',
          'chrome >= 70',
          'defaults',
          'not IE 11',
        ],
        modernPolyfills: true,
      }),
    ],
    server: {
      watch: {
        usePolling: true,
      },
    },
  },
})
