import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // logLevel: 'error',
  plugins: [vue(), { src: '~/plugins/ymapPlugin.js', mode: 'client' }],
  assetsInclude: ['**/*.docx', '**/*.doc'],
  css: { devSourcemap: false },
  server: {
    port: 3000,
    hmr: { overlay: false },
    proxy: {
      '/api': {
        target: 'http://109.207.172.16:4433/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/storage': {
        target: 'http://109.207.172.16:4433/storage',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/storage/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
