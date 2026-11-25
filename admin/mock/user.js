let list = [
  { id: 1, name: '张明', username: 'zhangm001', departmentId: 3, departmentName: '设备管理部（总部）', position: '部门经理', roleIds: [1], roleNames: ['系统管理员'], phone: '13811111111', status: 1, createTime: '2025-07-25 09:00' },
  { id: 2, name: '李华', username: 'lihua002', departmentId: 4, departmentName: '技术研发中心', position: '高级工程师', roleIds: [2], roleNames: ['巡检专员'], phone: '13822222222', status: 1, createTime: '2025-07-24 10:30' },
  { id: 3, name: '王芳', username: 'wangf003', departmentId: 5, departmentName: '财务部', position: '会计', roleIds: [3], roleNames: ['维修工程师'], phone: '13833333333', status: 0, createTime: '2025-07-23 14:15' },
  { id: 4, name: '赵强', username: 'zhaoq004', departmentId: 6, departmentName: '人力资源部', position: 'HR专员', roleIds: [4], roleNames: ['备件管理员'], phone: '13844444444', status: 1, createTime: '2025-07-22 16:45' },
  { id: 5, name: '刘洋', username: 'liuy005', departmentId: 7, departmentName: '杭州厂区', position: '巡检员', roleIds: [2], roleNames: ['巡检专员'], phone: '13855555555', status: 1, createTime: '2025-07-21 11:20' }
]

export default [
  {
    url: '/api/user/list',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, name, departmentId, roleId, status } = query
      let filtered = [...list]
      if (name) filtered = filtered.filter(item => item.name.includes(name) || item.username.includes(name))
      if (departmentId) filtered = filtered.filter(item => item.departmentId === Number(departmentId))
      if (roleId) filtered = filtered.filter(item => item.roleIds && item.roleIds.includes(Number(roleId)))
      if (status !== undefined && status !== '') filtered = filtered.filter(item => item.status === Number(status))
      const total = filtered.length
      const start = (page - 1) * pageSize
      return { code: 200, message: '获取成功', data: { list: filtered.slice(start, start + Number(pageSize)), total, page: Number(page), pageSize: Number(pageSize) } }
    }
  },
  {
    url: '/api/user/add',
    method: 'post',
    response: ({ body }) => {
      const item = { id: Date.now(), ...body, createTime: new Date().toLocaleString('zh-CN', { hour12: false }) }
      list.push(item)
      return { code: 200, message: '新增成功', data: item }
    }
  },
  {
    url: '/api/user/update',
    method: 'put',
    response: ({ body }) => {
      const idx = list.findIndex(item => item.id === body.id)
      if (idx > -1) list[idx] = { ...list[idx], ...body }
      return { code: 200, message: '更新成功', data: null }
    }
  },
  {
    url: '/api/user/delete',
    method: 'delete',
    response: ({ query }) => {
      list = list.filter(item => item.id !== Number(query.id))
      return { code: 200, message: '删除成功', data: null }
    }
  },
  {
    url: '/api/user/status',
    method: 'put',
    response: ({ body }) => {
      const idx = list.findIndex(item => item.id === body.id)
      if (idx > -1) list[idx].status = body.status
      return { code: 200, message: '状态更新成功', data: null }
    }
  },
  {
    url: '/api/user/reset-password',
    method: 'put',
    response: () => ({ code: 200, message: '密码重置成功', data: null })
  }
]
