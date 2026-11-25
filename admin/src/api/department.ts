import axios from 'axios'

export interface DepartmentItem {
  id: number
  name: string
  type: 'company' | 'factory' | 'department'
  leaderId: number | null
  leaderName: string | null
  phone: string
  sort: number
  status: number
  parentId: number | null
  updateTime: string
  children?: DepartmentItem[]
}

export interface DepartmentForm {
  id?: number
  name: string
  type: string
  leaderId: number | null
  phone: string
  sort: number
  status: number
  parentId: number | null
}

export interface LeaderOption {
  id: number
  name: string
}

export const getDepartmentList = () => {
  return axios.get<{ code: number; message: string; data: DepartmentItem[] }>('/api/department/list')
}

export const addDepartment = (data: Omit<DepartmentForm, 'id'>) => {
  return axios.post<{ code: number; message: string; data: DepartmentItem }>('/api/department/add', data)
}

export const updateDepartment = (data: DepartmentForm) => {
  return axios.put<{ code: number; message: string; data: null }>('/api/department/update', data)
}

export const deleteDepartment = (id: number) => {
  return axios.delete<{ code: number; message: string; data: null }>(`/api/department/delete?id=${id}`)
}

export const updateDepartmentStatus = (id: number, status: number) => {
  return axios.put<{ code: number; message: string; data: null }>('/api/department/status', { id, status })
}

export const getLeaderList = () => {
  return axios.get<{ code: number; message: string; data: LeaderOption[] }>('/api/department/leaders')
}
