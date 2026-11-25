/**
 * 路由配置
 */
import { createBrowserRouter } from 'react-router-dom'
import RequireAuth from '@/components/layout/RequireAuth'
import MainLayout from '@/components/layout/MainLayout'
import Login     from '@/pages/login/Login'
import Home      from '@/pages/home/Home'
import Workspace from '@/pages/workspace/Workspace'
import Message   from '@/pages/message/Message'
import Profile   from '@/pages/profile/Profile'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <RequireAuth><MainLayout /></RequireAuth>,
    children: [
      { index: true,       element: <Home /> },
      { path: 'home',      element: <Home /> },
      { path: 'workspace', element: <Workspace /> },
      { path: 'message',   element: <Message /> },
      { path: 'profile',   element: <Profile /> },
    ]
  }
])

export default router
