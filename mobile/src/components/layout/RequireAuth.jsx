/**
 * 路由守卫：未登录跳转登录页
 */
import { Navigate } from 'react-router-dom'

export default function RequireAuth({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}
