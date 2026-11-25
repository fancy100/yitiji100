import axios from 'axios'

export interface User {
  id: number
  username: string
  email: string
  status: string
  createTime: string
}

export const getUsers = () => {
  return axios.get<{ code: number; message: string; data: User[] }>('/api/users')
}

// 组织管理 - 人员管理
export interface UserItem {
  id: number
  name: string
  username: string
  departmentId: number
  departmentName: string
  position: string
  roleIds: number[]
  roleNames: string[]
  phone: string
  status: number
  createTime: string
}

export interface UserForm {
  id?: number
  name: string
  username: string
  password?: string
  departmentId: number
  position: string
  roleIds: number[]
  phone: string
  status: number
}

export interface UserListResponse {
  list: UserItem[]
  total: number
  page: number
  pageSize: number
}

export const getUserList = (params: { page: number; pageSize: number; name?: string; departmentId?: number; roleId?: number; status?: number }) => {
  return axios.get<{ code: number; message: string; data: UserListResponse }>('/api/user/list', { params })
}

export const addUser = (data: Omit<UserForm, 'id'>) => {
  return axios.post<{ code: number; message: string; data: UserItem }>('/api/user/add', data)
}

export const updateUser = (data: UserForm) => {
  return axios.put<{ code: number; message: string; data: null }>('/api/user/update', data)
}

export const deleteUser = (id: number) => {
  return axios.delete<{ code: number; message: string; data: null }>(`/api/user/delete?id=${id}`)
}

export const updateUserStatus = (id: number, status: number) => {
  return axios.put<{ code: number; message: string; data: null }>('/api/user/status', { id, status })
}

export const resetPassword = (id: number) => {
  return axios.put<{ code: number; message: string; data: null }>('/api/user/reset-password', { id })
}
