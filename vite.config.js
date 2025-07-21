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
      '5174-ig7mkyaiahxgv8d4q29w5-96582e46.manusvm.computer'
    ]
  },
  preview: {
    port: 3000,
    allowedHosts: [
      'efootball-mobile-app.onrender.com',
      'dreafootball.onrender.com'
    ]
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        sw: './public/firebase-messaging-sw.js'
      }
    }
  }
})

