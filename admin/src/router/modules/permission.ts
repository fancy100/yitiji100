import type { RouteRecordRaw } from 'vue-router'

const permissionRoutes: RouteRecordRaw[] = [
  {
    path: '/permission/menu',
    name: 'PermissionMenu',
    component: () => import('@/views/Permission/Menu'),
    meta: {
      title: '菜单管理'
    }
  },
  {
    path: '/permission/role',
    name: 'PermissionRole',
    component: () => import('@/views/Permission/Role'),
    meta: {
      title: '角色管理'
    }
  }
]

export default permissionRoutes
