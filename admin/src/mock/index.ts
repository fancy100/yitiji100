/**
 * Mock 数据入口
 * 使用 mockjs 在浏览器端拦截 XHR 请求
 * 通过 .env 的 VITE_USE_MOCK 控制开关
 * 注意：原始 XMLHttpRequest 在 main.ts 中保存（import 会提升，不能在这里保存）
 */
import Mock from 'mockjs'

// 只导入组织管理和权限管理相关的 mock 模块
import authMocks from '../../mock/auth'
import departmentMocks from '../../mock/department'
import userMocks from '../../mock/user'
import positionMocks from '../../mock/position'
import menuMocks from '../../mock/menu'
import roleMocks from '../../mock/role'

// 注册 mock 接口
function setupMock() {
  Mock.setup({ timeout: '100-300' })

  const allMocks = [
    ...authMocks,
    ...departmentMocks,
    ...userMocks,
    ...positionMocks,
    ...menuMocks,
    ...roleMocks,
  ]

  allMocks.forEach(({ url, method, response }) => {
    const urlPattern = new RegExp(url.replace(/:(w+)/g, '([^/]+)'))
    const httpMethod = (method || 'get').toLowerCase()

    Mock.mock(urlPattern, httpMethod, (options: any) => {
      let body = {}
      let query: Record<string, string> = {}
      let params: Record<string, string> = {}

      if (options.body) {
        try { body = JSON.parse(options.body) } catch { body = {} }
      }

      const urlObj = new URL(options.url, 'http://localhost')
      urlObj.searchParams.forEach((value, key) => { query[key] = value })

      const match = options.url.match(urlPattern)
      const paramNames = (url.match(/:(w+)/g) || []).map((p: string) => p.slice(1))
      paramNames.forEach((name: string, idx: number) => {
        if (match && match[idx + 1]) params[name] = match[idx + 1]
      })

      return response({ body, query, params, headers: {} })
    })
  })
}

// 开关：VITE_USE_MOCK=true 时才注册
if (import.meta.env.VITE_USE_MOCK === 'true') {
  setupMock()
}
