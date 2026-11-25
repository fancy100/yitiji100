let list = [
  { id: 1, name: '部门经理', description: '负责部门日常管理与协调', createTime: '2025-07-20 09:00' },
  { id: 2, name: '高级工程师', description: '负责技术攻关与方案设计', createTime: '2025-07-20 09:00' },
  { id: 3, name: '工程师', description: '负责设备维护与技术支持', createTime: '2025-07-20 09:00' },
  { id: 4, name: '巡检员', description: '负责设备日常巡检与记录', createTime: '2025-07-20 09:00' },
  { id: 5, name: 'HR专员', description: '负责人力资源管理工作', createTime: '2025-07-20 09:00' },
  { id: 6, name: '会计', description: '负责财务核算与报表', createTime: '2025-07-20 09:00' },
  { id: 7, name: '技术员', description: '负责设备安装调试', createTime: '2025-07-20 09:00' }
]

export default [
  {
    url: '/api/position/list',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, name } = query
      let filtered = name ? list.filter(item => item.name.includes(name)) : [...list]
      const total = filtered.length
      const start = (page - 1) * pageSize
      return {
        code: 200,
        message: 'success',
        data: { list: filtered.slice(start, start + Number(pageSize)), total, page: Number(page), pageSize: Number(pageSize) }
      }
    }
  },
  {
    url: '/api/position/add',
    method: 'post',
    response: ({ body }) => {
      const item = { id: Date.now(), ...body, createTime: new Date().toLocaleString('zh-CN', { hour12: false }) }
      list.push(item)
      return { code: 200, message: '新增成功', data: item }
    }
  },
  {
    url: '/api/position/update',
    method: 'put',
    response: ({ body }) => {
      const idx = list.findIndex(item => item.id === body.id)
      if (idx > -1) list[idx] = { ...list[idx], ...body }
      return { code: 200, message: '更新成功', data: null }
    }
  },
  {
    url: '/api/position/delete',
    method: 'delete',
    response: ({ query }) => {
      const id = Number(query.id)
      list = list.filter(item => item.id !== id)
      return { code: 200, message: '删除成功', data: null }
    }
  }
]
