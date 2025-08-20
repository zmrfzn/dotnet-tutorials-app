import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port:80,
    allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0','.instruqt.io']
  }
})
