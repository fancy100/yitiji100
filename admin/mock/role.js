let list = [
  { id: 1, name: '系统管理员', description: '临时片区', userCount: 0, sort: 1, status: 1, createTime: '2025-07-25 14:30', menuIds: [1, 2, 3, 4, 5] },
  { id: 2, name: '巡检专员', description: '日常巡检与维护', userCount: 10, sort: 2, status: 0, createTime: '2025-07-24 11:20', menuIds: [1, 2] },
  { id: 3, name: '维修工程师', description: '故障诊断与修复', userCount: 2, sort: 3, status: 1, createTime: '2025-07-23 09:45', menuIds: [1, 3, 4] },
  { id: 4, name: '备件管理员', description: '备品备件存管理', userCount: 3, sort: 4, status: 1, createTime: '2025-07-21 13:50', menuIds: [1, 5] }
]

export default [
  {
    url: '/api/role/list',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, name, status } = query
      let filtered = [...list]
      if (name) filtered = filtered.filter(item => item.name.includes(name))
      if (status !== undefined && status !== '') filtered = filtered.filter(item => item.status === Number(status))
      const total = filtered.length
      const start = (page - 1) * pageSize
      return { code: 200, message: '获取成功', data: { list: filtered.slice(start, start + Number(pageSize)), total, page: Number(page), pageSize: Number(pageSize) } }
    }
  },
  {
    url: '/api/role/add',
    method: 'post',
    response: ({ body }) => {
      const item = { id: Date.now(), ...body, userCount: 0, createTime: new Date().toLocaleString('zh-CN', { hour12: false }), menuIds: [] }
      list.push(item)
      return { code: 200, message: '新增成功', data: item }
    }
  },
  {
    url: '/api/role/update',
    method: 'put',
    response: ({ body }) => {
      const idx = list.findIndex(item => item.id === body.id)
      if (idx > -1) list[idx] = { ...list[idx], ...body }
      return { code: 200, message: '更新成功', data: null }
    }
  },
  {
    url: '/api/role/delete',
    method: 'delete',
    response: ({ query }) => {
      list = list.filter(item => item.id !== Number(query.id))
      return { code: 200, message: '删除成功', data: null }
    }
  },
  {
    url: '/api/role/status',
    method: 'put',
    response: ({ body }) => {
      const idx = list.findIndex(item => item.id === body.id)
      if (idx > -1) list[idx].status = body.status
      return { code: 200, message: '状态更新成功', data: null }
    }
  },
  {
    url: '/api/role/assign-menu',
    method: 'put',
    response: ({ body }) => {
      const idx = list.findIndex(item => item.id === body.roleId)
      if (idx > -1) list[idx].menuIds = body.menuIds
      return { code: 200, message: '权限分配成功', data: null }
    }
  }
]
