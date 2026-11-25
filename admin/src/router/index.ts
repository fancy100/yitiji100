import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '@/layouts/MainLayout'

// 只保留组织管理和权限管理路由模块
import organizationRoutes from './modules/organization'
import permissionRoutes from './modules/permission'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: MainLayout,
    redirect: '/organization/department',
    children: [
      ...organizationRoutes,
      ...permissionRoutes,
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：未登录跳转到登录页
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta?.title) {
    document.title = `${to.meta.title} - 管理后台`
  }

  if (to.path !== '/login' && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/organization/department')
  } else {
    next()
  }
})

export default router
