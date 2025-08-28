import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from 'tailwindcss'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,ts,css,html,ico,jpg,jpeg,png,svg}']
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
})
