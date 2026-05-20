import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
      tailwindcss(),
      VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['favicon.ico'],
          manifest: {
              name: 'Gym Tracker',
              short_name: 'GymTracker',
              description: 'Offline workout tracker',
              theme_color: "#020617",
              background_color: "#020617",
              display: 'standalone',
              orientation: 'portrait',
              start_url: '/',
              icons: [
                  { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
                  { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
              ]
          },
          workbox: {
              globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
              runtimeCaching: [
                  {
                      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                      handler: 'CacheFirst'
                  }
              ]
          }
      })
  ],
    base: '/gym-tracker'
})
