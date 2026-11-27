import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
// import fs from 'fs';
// import path from 'path';
import {
  nutrients_api_proxy_addr,
  nutrients_img_proxy_addr,
  nutrients_dest_root,
} from './src/nutrients_target_config.ts';

export default defineConfig({
  base: nutrients_dest_root,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        maximumFileSizeToCacheInBytes: 50 * 1024 * 1024,
      },
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'Содержание питательных веществ',
        short_name: 'Нутриенты',
        start_url: '/nutrient-frontend/',
        scope: '/nutrient-frontend/',
        display: 'standalone',
        background_color: '#f5f5f5',
        theme_color: '#259b23',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'logo192.png',
            type: 'image/png',
            sizes: '192x192',
          },
          {
            src: 'logo512.png',
            type: 'image/png',
            sizes: '512x512',
          },
        ],
      },
    }),
  ],
  server: {
    host: true,
    port: 5173,
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
    //   cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    // },
    proxy: {
      '/api': {
        target: nutrients_api_proxy_addr,
        changeOrigin: true,
        secure: false,
      },
      '/media': {
        target: nutrients_img_proxy_addr,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});