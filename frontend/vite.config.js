import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  const isDev = mode === 'development'
  const isTest = mode === 'test'
  const isProd = mode === 'production'

  console.log(`🔧 Vite building in ${mode} mode (command: ${command})`)

  return {
    plugins: [react()],
    mode: mode,
    build: {
      minify: isProd ? 'esbuild' : false,
      sourcemap: isDev || isTest,
      rollupOptions: {
        output: {
          manualChunks: isProd ? {
            vendor: ['react', 'react-dom'],
            motion: ['framer-motion']
          } : undefined
        }
      }
    },
    server: {
      port: 5173,
      host: true,
      allowedHosts: true,
      proxy: { '/api': 'http://localhost:3001' }
    },
    define: {
      __DEV__: isDev,
      __TEST__: isTest,
      __PROD__: isProd
    }
  }
})
