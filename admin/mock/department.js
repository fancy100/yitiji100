let tree = [
  {
    id: 1, name: '浙江省公司', type: 'company', leaderId: null, leaderName: null, phone: '', sort: 1, status: 1, parentId: null, updateTime: '2025-07-25 09:00',
    children: [
      { id: 2, name: '公司领导', type: 'department', leaderId: 1, leaderName: '王伟', phone: '', sort: 1, status: 1, parentId: 1, updateTime: '2025-07-25 10:30', children: [] },
      { id: 3, name: '设备管理部', type: 'department', leaderId: 2, leaderName: '李强', phone: '', sort: 2, status: 1, parentId: 1, updateTime: '2025-07-24 14:15', children: [] },
      { id: 4, name: '技术研发中心', type: 'department', leaderId: 3, leaderName: '赵华', phone: '', sort: 3, status: 1, parentId: 1, updateTime: '2025-07-23 16:45', children: [] },
      { id: 5, name: '财务部', type: 'department', leaderId: 4, leaderName: '陈林', phone: '', sort: 4, status: 1, parentId: 1, updateTime: '2025-07-22 11:20', children: [] },
      { id: 6, name: '人力资源部', type: 'department', leaderId: 5, leaderName: '杨帆', phone: '', sort: 5, status: 1, parentId: 1, updateTime: '2025-07-21 13:50', children: [] },
      {
        id: 7, name: '杭州分厂', type: 'factory', leaderId: null, leaderName: null, phone: '', sort: 6, status: 1, parentId: 1, updateTime: '2025-07-20 15:10',
        children: [
          { id: 8, name: '生产部', type: 'department', leaderId: null, leaderName: null, phone: '', sort: 1, status: 1, parentId: 7, updateTime: '2025-07-20 15:10', children: [] },
          { id: 9, name: '安全环保部', type: 'department', leaderId: null, leaderName: null, phone: '', sort: 2, status: 1, parentId: 7, updateTime: '2025-07-20 15:10', children: [] }
        ]
      },
      {
        id: 10, name: '宁波分厂', type: 'factory', leaderId: null, leaderName: null, phone: '', sort: 7, status: 1, parentId: 1, updateTime: '2025-07-19 09:00',
        children: [
          { id: 11, name: '生产部', type: 'department', leaderId: null, leaderName: null, phone: '', sort: 1, status: 1, parentId: 10, updateTime: '2025-07-19 09:00', children: [] }
        ]
      }
    ]
  }
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

const leaders = [
  { id: 1, name: '王伟' }, { id: 2, name: '李强' }, { id: 3, name: '赵华' },
  { id: 4, name: '陈林' }, { id: 5, name: '杨帆' }
]

export default [
  {
    url: '/api/department/list',
    method: 'get',
    response: () => ({ code: 200, message: '获取成功', data: tree })
  },
  {
    url: '/api/department/add',
    method: 'post',
    response: ({ body }) => {
      const item = { id: Date.now(), ...body, updateTime: new Date().toLocaleString('zh-CN', { hour12: false }), children: [] }
      if (body.parentId) {
        const parent = findNode(tree, body.parentId)
        if (parent) parent.children.push(item)
      } else {
        tree.push(item)
      }
      return { code: 200, message: '新增成功', data: item }
    }
  },
  {
    url: '/api/department/update',
    method: 'put',
    response: ({ body }) => {
      const node = findNode(tree, body.id)
      if (node) Object.assign(node, body, { updateTime: new Date().toLocaleString('zh-CN', { hour12: false }) })
      return { code: 200, message: '更新成功', data: null }
    }
  },
  {
    url: '/api/department/delete',
    method: 'delete',
    response: ({ query }) => {
      removeNode(tree, Number(query.id))
      return { code: 200, message: '删除成功', data: null }
    }
  },
  {
    url: '/api/department/status',
    method: 'put',
    response: ({ body }) => {
      const node = findNode(tree, body.id)
      if (node) node.status = body.status
      return { code: 200, message: '状态更新成功', data: null }
    }
  },
  {
    url: '/api/department/leaders',
    method: 'get',
    response: () => ({ code: 200, message: '获取成功', data: leaders })
  }
]
