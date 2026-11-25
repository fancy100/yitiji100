/**
 * Axios 请求封装
 */
import axios from 'axios'
import { Toast } from 'antd-mobile'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截：自动带 token
request.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 响应拦截：统一错误提示
request.interceptors.response.use(
  res => res.data,
  err => {
    const msg = err.response?.data?.message || '网络请求失败'
    Toast.show({ content: msg, icon: 'fail' })
    return Promise.reject(err)
  }
)

export default request
