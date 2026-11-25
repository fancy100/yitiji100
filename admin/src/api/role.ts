import axios from 'axios'

export interface RoleItem {
  id: number
  name: string
  description: string
  userCount: number
  sort: number
  status: number
  createTime: string
  menuIds: number[]
}

export interface RoleForm {
  id?: number
  name: string
  description: string
  sort: number
  status: number
}

export interface RoleListResponse {
  list: RoleItem[]
  total: number
  page: number
  pageSize: number
}

export const getRoleList = (params: { page: number; pageSize: number; name?: string; status?: number }) => {
  return axios.get<{ code: number; message: string; data: RoleListResponse }>('/api/role/list', { params })
}

export const addRole = (data: Omit<RoleForm, 'id'>) => {
  return axios.post<{ code: number; message: string; data: RoleItem }>('/api/role/add', data)
}

export const updateRole = (data: RoleForm) => {
  return axios.put<{ code: number; message: string; data: null }>('/api/role/update', data)
}

export const deleteRole = (id: number) => {
  return axios.delete<{ code: number; message: string; data: null }>(`/api/role/delete?id=${id}`)
}

export const updateRoleStatus = (id: number, status: number) => {
  return axios.put<{ code: number; message: string; data: null }>('/api/role/status', { id, status })
}

export const assignMenu = (roleId: number, menuIds: number[]) => {
  return axios.put<{ code: number; message: string; data: null }>('/api/role/assign-menu', { roleId, menuIds })
}
