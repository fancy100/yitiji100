import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig({
  base:'/',
  plugins: [
    vue(),
    // Mock 服务
    viteMockServe({
      mockPath: 'mock',
      enable: true
    }),
    // 开发环境：标注数据保存中间件，直接写入 public/annotations/ 目录
    {
      name: 'annotation-save',
      configureServer(server) {
        server.middlewares.use('/api/annotation/save', (req, res) => {
          if (req.method !== 'POST') { res.statusCode = 405; res.end(); return }
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const data = JSON.parse(body)
              const fileName = data.page.replace(/^\//, '').replace(/\//g, '-') || 'index'
              const filePath = path.resolve(__dirname, `public/annotations/${fileName}.json`)
              fs.mkdirSync(path.dirname(filePath), { recursive: true })
              fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ code: 200, message: '保存成功' }))
            } catch (e) {
              res.statusCode = 500
              res.end(JSON.stringify({ code: 500, message: '保存失败' }))
            }
          })
        })
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  server: {
    port: 3800,
    proxy: {
      // 地图数据代理
      '/map-api': {
        target: 'https://geo.datav.aliyun.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/map-api/, '')
      }
    }
  }
})
