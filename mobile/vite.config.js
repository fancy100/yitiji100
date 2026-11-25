import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import pxtorem from 'postcss-pxtorem'

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    postcss: {
      plugins: [
        // px 转 rem，设计稿 375px，根字体 37.5px
        pxtorem({
          rootValue: 37.5,
          propList: ['*'],
          exclude: /node_modules/
        })
      ]
    }
  },
  server: {
    host: true,
    port: 3100,
    open: true
  }
})
