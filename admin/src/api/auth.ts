import axios from 'axios'

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  username: string
}

export const login = (data: LoginParams) => {
  return axios.post<{ code: number; message: string; data: LoginResponse }>('/api/login', data)
}

export const logout = () => {
  return axios.post('/api/logout')
}
