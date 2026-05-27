import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
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
              start_url: '/gym-tracker',
              icons: [
                  { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
                  { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
              ]
          },
          workbox: {
              globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,json}'],
              runtimeCaching: [
                  {
                      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                      handler: 'CacheFirst',
                      options: { cacheName: 'google-fonts' }
                  }
              ]
          }
      })
  ],
    server: {
      proxy: {
          '/api/exercises': {
              target: 'https://exercisedb.dev',
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api\/exercises/, '/api/v1/exercises'),
              secure: true,
          }
      }
    },
    base: command === 'build' ? '/gym-tracker/' : '/',
}))
