import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";

export default defineConfig({
  plugins: [vue(),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "pages": path.resolve(__dirname, "src/pages")
    }
  },
  server: {
    host: "0.0.0.0",
    port: 7777,
    // proxy: {
    //   "/api": {
    //     target: 'http://192.168.8.58:8080',
    //     changeOrigin: true,
    //   }
    // }
  }
})
