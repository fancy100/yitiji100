/**
 * 应用入口
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { UserProvider } from '@/store/userStore'
import router from '@/router'

// rem 适配（最先执行）
import './utils/flexible'

// Ant Design Mobile 样式
import 'antd-mobile/es/global'

// 全局样式
import './assets/styles/main.css'

// Mock 数据
import './mock'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
)
