import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.png', 'icons/*.svg', 'fonts/*', 'tesseract/*'],
      manifest: {
        name: 'Bengü Taş — Göktürkçe Çevirmen',
        short_name: 'Bengü Taş',
        description: 'Elinle yaz, atalarının yazısıyla oku — el yazısını Göktürk alfabesine çeviren web uygulaması.',
        theme_color: '#0E1B2B',
        background_color: '#0E1B2B',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: './',
        scope: './',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,wasm,gz,traineddata,onnx,json}'],
        maximumFileSizeToCacheInBytes: 40 * 1024 * 1024 // 40MB to allow ONNX runtime & traineddata cache
      }
    })
  ],
  server: {
    port: 3000,
    open: false
  }
})
