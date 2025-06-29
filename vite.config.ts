import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(async () => {
  const tailwindcssPostcss = await import('@tailwindcss/postcss')
  const autoprefixer = await import('autoprefixer')
  
  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    css: {
      postcss: {
        plugins: [
          tailwindcssPostcss.default,
          autoprefixer.default,
        ],
      },
    },
  }
})
