import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5174,
    allowedHosts: [
      'all',
      '5174-iocdnome8as4e3r2yvg2w-1ead68e0.manusvm.computer'
    ]
  },
  preview: {
    port: 3000,
    allowedHosts: [
      'efootball-mobile-app.onrender.com',
      'dreafootball.onrender.com'
    ]
  }
})
