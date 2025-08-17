import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2019',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          chakra: ['@chakra-ui/react', '@emotion/react', '@emotion/styled', 'framer-motion'],
          charts: ['chart.js', 'react-chartjs-2', 'recharts'],
        }
      }
    }
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  }
})
