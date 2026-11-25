/**
 * 用户状态管理（简单的 Context + localStorage）
 */
import { createContext, useContext, useState } from 'react'
import { login as loginApi } from '@/api/auth'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '')
  const [userId,   setUserId]   = useState(localStorage.getItem('userId')   || '')

  const loginAction = async (account, password) => {
    const res = await loginApi({ account, password })
    if (res.code === 200) {
      localStorage.setItem('token',    res.data.token)
      localStorage.setItem('userName', res.data.userName)
      localStorage.setItem('userId',   res.data.userId)
      setUserName(res.data.userName)
      setUserId(res.data.userId)
    }
    return res
  }

  const logoutAction = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    localStorage.removeItem('userId')
    setUserName('')
    setUserId('')
  }

  return (
    <UserContext.Provider value={{ userName, userId, login: loginAction, logout: logoutAction }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
