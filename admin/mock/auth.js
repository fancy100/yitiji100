export default [
  {
    url: '/api/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body
      if (username === 'admin' && password === '123456') {
        return {
          code: 200,
          message: 'success',
          data: {
            token: 'mock-token-' + Date.now(),
            username: 'admin'
          }
        }
      }
      return {
        code: 401,
        message: '用户名或密码错误'
      }
    }
  },
  {
    url: '/api/logout',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: 'success'
      }
    }
  }
]
