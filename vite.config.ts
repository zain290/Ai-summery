import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5316,
    proxy: {
      '/api': 'http://localhost:5317',
      '/robots.txt': 'http://localhost:5317',
      '/sitemap.xml': 'http://localhost:5317',
      '/sitemap.txt': 'http://localhost:5317',
    },
  },
})
