// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/my-spotify-analyzer/", // GitHub Pages公開用の設定
  server: {
    host: true, // 外部からのアクセスを許可する設定
    hmr: {
      // WebSocket接続のための設定
      protocol: 'ws',
      host: '13.158.36.16', // ★★★ あなたのEC2の現在のパブリックIPアドレスに書き換えてください ★★★
    }
  }
})
