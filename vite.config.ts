import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // 若使用 @tailwindcss/vite
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// ⚠️ 請將這裡替換為你的 GitHub 倉庫名稱，前後都要有斜線「/」
const baseRepoName = '/<2026-seoul-JxJ>/';

export default defineConfig(() => {
  return {
    base: baseRepoName, // 👈 修正靜態資源路徑，解決白畫面關鍵
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg'],
        manifest: {
          id: baseRepoName,
          name: '2026 首爾秋日獨旅手冊',
          short_name: '首爾獨旅手冊',
          description: '2026/10/29 - 11/03 首爾 6 天 5 夜自由行行程手冊，整合匯率換算、行李配重試算與離線時間軸。',
          theme_color: '#FAF7F2',
          background_color: '#FAF7F2',
          display: 'standalone',
          start_url: baseRepoName,
          scope: baseRepoName,
          icons: [
            {
              src: `${baseRepoName}pwa-192x192.png`,
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: `${baseRepoName}pwa-512x512.png`,
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: `${baseRepoName}pwa-maskable-512x512.png`,
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
