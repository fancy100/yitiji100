/**
 * Mock 数据
 * 模拟后端接口，开发阶段使用
 */
import Mock from 'mockjs'

Mock.setup({ timeout: '100-300' })

// ==================== 认证 ====================

// POST /api/auth/login - 用户登录
Mock.mock('/api/auth/login', 'post', (options) => {
  const body = JSON.parse(options.body)
  if (body.account && body.password) {
    return {
      code: 200,
      message: '登录成功',
      data: {
        token: 'mock-token-' + Date.now(),
        userName: '张三',
        userId: 'U10001',
        role: '巡检员'
      }
    }
  }
  return { code: 401, message: '账号或密码错误', data: null }
})

// ==================== 工作台 ====================

// 待办事项持久化数据
const todosData = [
  {
    id: 'T001',
    type: '整改审核',
    typeColor: '#F53F3F',
    title: 'WD20260505001',
    device: '1号变压器',
    deadline: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3小时后，即将超期
    urgent: true
  },
  {
    id: 'T002',
    type: '整改执行',
    typeColor: '#FF7D00',
    title: 'WD20260504003',
    device: '2号配电柜',
    deadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 2天后
    urgent: false
  },
  {
    id: 'T003',
    type: '整改复核',
    typeColor: '#1677FF',
    title: 'WD20260503007',
    device: '冷却水泵A',
    deadline: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(), // 20小时后，即将超期
    urgent: false
  },
  {
    id: 'T004',
    type: '整改执行',
    typeColor: '#FF7D00',
    title: 'WD20260502012',
    device: '消防泵房设备',
    deadline: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // 3天后
    urgent: false
  }
]

// GET /api/workbench/todos - 获取待办事项
Mock.mock('/api/workbench/todos', 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: {
      list: todosData,
      summary: {
        audit: todosData.filter(t => t.type === '整改审核').length,
        execute: todosData.filter(t => t.type === '整改执行').length,
        review: todosData.filter(t => t.type === '整改复核').length
      }
    }
  }
})

// GET /api/workbench/stats - 获取统计图表数据
Mock.mock('/api/workbench/stats', 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: {
      // 近7天巡检完成率趋势
      inspectionTrend: {
        dates: ['04-29', '04-30', '05-01', '05-02', '05-03', '05-04', '05-05'],
        rates: [85, 92, 78, 95, 88, 96, 90]
      },
      // 设备异常分布
      deviceAbnormal: [
        { name: '电气故障', value: 12, color: '#F53F3F' },
        { name: '机械磨损', value: 8,  color: '#FF7D00' },
        { name: '仪表异常', value: 5,  color: '#FAAD14' },
        { name: '其他',     value: 3,  color: '#8C909A' }
      ],
      // 本月整改工单统计
      workorderStats: {
        total: 28,
        completed: 19,
        pending: 9,
        completionRate: 68
      }
    }
  }
})

// GET /api/workbench/announcements - 获取通知公告
Mock.mock('/api/workbench/announcements', 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: {
      list: [
        {
          id: 'A001',
          title: '关于开展5月份设备专项巡检的通知',
          publishTime: '2026-05-04 09:00:00',
          hasAttachment: true
        },
        {
          id: 'A002',
          title: '巡检系统升级维护公告（5月6日凌晨）',
          publishTime: '2026-05-03 16:30:00',
          hasAttachment: false
        },
        {
          id: 'A003',
          title: '关于规范整改工单填写要求的通知',
          publishTime: '2026-05-02 10:00:00',
          hasAttachment: true
        },
        {
          id: 'A004',
          title: '4月份巡检工作总结及5月计划安排',
          publishTime: '2026-05-01 14:00:00',
          hasAttachment: false
        },
        {
          id: 'A005',
          title: '新增巡检点位说明及操作指引',
          publishTime: '2026-04-28 09:30:00',
          hasAttachment: true
        }
      ],
      total: 12
    }
  }
})

// GET /api/workbench/documents - 获取制度文档
Mock.mock('/api/workbench/documents', 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: {
      list: [
        {
          id: 'D001',
          name: '设备巡检操作规程 V2.1',
          category: '操作规程',
          uploadTime: '2026-04-15',
          fileType: 'pdf',
          fileSize: '2.3MB'
        },
        {
          id: 'D002',
          name: '整改工单管理办法',
          category: '管理制度',
          uploadTime: '2026-04-10',
          fileType: 'pdf',
          fileSize: '1.1MB'
        },
        {
          id: 'D003',
          name: '安全生产责任制度',
          category: '安全制度',
          uploadTime: '2026-03-20',
          fileType: 'pdf',
          fileSize: '3.5MB'
        },
        {
          id: 'D004',
          name: '巡检人员培训手册',
          category: '培训资料',
          uploadTime: '2026-03-01',
          fileType: 'pdf',
          fileSize: '5.2MB'
        }
      ]
    }
  }
})

// ==================== 用户 ====================

// GET /api/user/profile - 获取当前用户个人信息
Mock.mock('/api/user/profile', 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: {
      userId:     'U10001',
      userName:   '张三',
      workNo:     'EMP20240001',
      phone:      '138****8001',
      department: '运维部门',
      position:   '普通员工',
      role:       '普通用户',
      status:     '正常',
      avatar:     '',
      joinDate:   '2024-03-01',
      lastLogin:  '2026-05-05 08:30:00'
    }
  }
})
