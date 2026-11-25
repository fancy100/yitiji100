import { h } from 'vue'
import {
  SafetyOutlined, MenuOutlined, TeamOutlined,
  ApartmentOutlined, ContactsOutlined, SolutionOutlined
} from '@ant-design/icons-vue'

// 侧边栏菜单配置，只保留组织管理和权限管理
// 新增路由时只需在此处维护，无需同步修改其他文件
export const menuItems = [
  {
    key: 'organization',
    icon: () => h(ApartmentOutlined),
    label: '组织管理',
    title: '组织管理',
    children: [
      { key: '/organization/department', icon: () => h(ApartmentOutlined), label: '部门管理', title: '部门管理' },
      { key: '/organization/user',       icon: () => h(ContactsOutlined),  label: '人员管理', title: '人员管理' },
      { key: '/organization/position',   icon: () => h(SolutionOutlined),  label: '岗位管理', title: '岗位管理' }
    ]
  },
  {
    key: 'permission',
    icon: () => h(SafetyOutlined),
    label: '权限管理',
    title: '权限管理',
    children: [
      { key: '/permission/menu', icon: () => h(MenuOutlined), label: '菜单管理', title: '菜单管理' },
      { key: '/permission/role', icon: () => h(TeamOutlined), label: '角色管理', title: '角色管理' }
    ]
  }
]
