import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const backendUrl = 'https://triptailor-backend-206035909634.asia-northeast3.run.app'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: backendUrl,
        changeOrigin: true,
      },
    },
  },
})
