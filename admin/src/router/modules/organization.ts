import type { RouteRecordRaw } from 'vue-router'

const organizationRoutes: RouteRecordRaw[] = [
  {
    path: '/organization/department',
    name: 'OrganizationDepartment',
    component: () => import('@/views/Organization/Department'),
    meta: { title: '部门管理' }
  },
  {
    path: '/organization/user',
    name: 'OrganizationUser',
    component: () => import('@/views/Organization/User'),
    meta: { title: '人员管理' }
  },
  {
    path: '/organization/position',
    name: 'OrganizationPosition',
    component: () => import('@/views/Organization/Position'),
    meta: { title: '岗位管理' }
  }
]

export default organizationRoutes
