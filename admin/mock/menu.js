let tree = [
  { id: 1, title: '工作台', type: 'menu', icon: 'DashboardOutlined', path: '/dashboard', component: 'Dashboard/index', permission: '', sort: 1, visible: 1, status: 1, parentId: null, children: [] },
  {
    id: 2, title: '权限管理', type: 'directory', icon: 'SafetyOutlined', path: '/permission', component: '', permission: '', sort: 2, visible: 1, status: 1, parentId: null,
    children: [
      {
        id: 3, title: '菜单管理', type: 'menu', icon: 'MenuOutlined', path: '/permission/menu', component: 'Permission/Menu/index', permission: 'permission:menu:list', sort: 1, visible: 1, status: 1, parentId: 2,
        children: [
          { id: 6, title: '新增菜单', type: 'button', icon: '', path: '', component: '', permission: 'permission:menu:add', sort: 1, visible: 1, status: 1, parentId: 3, children: [] },
          { id: 7, title: '编辑菜单', type: 'button', icon: '', path: '', component: '', permission: 'permission:menu:edit', sort: 2, visible: 1, status: 1, parentId: 3, children: [] },
          { id: 8, title: '删除菜单', type: 'button', icon: '', path: '', component: '', permission: 'permission:menu:delete', sort: 3, visible: 1, status: 1, parentId: 3, children: [] }
        ]
      },
      { id: 4, title: '角色管理', type: 'menu', icon: 'TeamOutlined', path: '/permission/role', component: 'Permission/Role/index', permission: 'permission:role:list', sort: 2, visible: 1, status: 1, parentId: 2, children: [] }
    ]
  },
  { id: 5, title: '用户管理', type: 'menu', icon: 'UserOutlined', path: '/users', component: 'Users/index', permission: 'system:user:list', sort: 3, visible: 1, status: 1, parentId: null, children: [] }
]

const findNode = (list, id) => {
  for (const node of list) {
    if (node.id === id) return node
    if (node.children) { const found = findNode(node.children, id); if (found) return found }
  }
  return null
}

const removeNode = (list, id) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) { list.splice(i, 1); return true }
    if (list[i].children && removeNode(list[i].children, id)) return true
  }
  return false
}

export default [
  {
    url: '/api/menu/list',
    method: 'get',
    response: () => ({ code: 200, message: 'success', data: tree })
  },
  {
    url: '/api/menu/add',
    method: 'post',
    response: ({ body }) => {
      const item = { id: Date.now(), ...body, children: [] }
      if (body.parentId) {
        const parent = findNode(tree, body.parentId)
        if (parent) parent.children.push(item)
      } else {
        tree.push(item)
      }
      return { code: 200, message: 'success', data: item }
    }
  },
  {
    url: '/api/menu/update',
    method: 'put',
    response: ({ body }) => {
      const node = findNode(tree, body.id)
      if (node) Object.assign(node, body)
      return { code: 200, message: 'success', data: null }
    }
  },
  {
    url: '/api/menu/delete',
    method: 'delete',
    response: ({ query }) => {
      removeNode(tree, Number(query.id))
      return { code: 200, message: 'success', data: null }
    }
  },
  {
    url: '/api/menu/status',
    method: 'put',
    response: ({ body }) => {
      const node = findNode(tree, body.id)
      if (node) node.status = body.status
      return { code: 200, message: 'success', data: null }
    }
  }
]
