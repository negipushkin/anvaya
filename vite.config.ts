import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Anvaya',
        short_name: 'Anvaya',
        description: 'A story, a talk, a small act — every week.',
        theme_color: '#FBF5EA',
        background_color: '#FBF5EA',
        display: 'standalone',
        start_url: '/',
        icons: []
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,webp,avif,jpg,jpeg,mp3,wav,ogg,m4a,json}'],
        maximumFileSizeToCacheInBytes: 20 * 1024 * 1024
      }
    })
  ]
})
