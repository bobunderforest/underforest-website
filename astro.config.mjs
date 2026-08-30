// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'
import legacy from '@vitejs/plugin-legacy'

// https://astro.build/config
export default defineConfig({
  site: 'https://bobunderforest.me',
  integrations: [react()],

  build: {
    assets: '_assets',
  },

  vite: {
    plugins: [
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
