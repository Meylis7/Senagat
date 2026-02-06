import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [vue()],
    assetsInclude: ['**/*.docx', '**/*.doc'],
    css: { devSourcemap: false },

    server: {
      port: 3000,
      hmr: { overlay: false },
      proxy: {
        '/storage': {
          target: `${env.VITE_API_BASE_URL}/storage`,
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
  }
})
