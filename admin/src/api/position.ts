import axios from 'axios'

export interface PositionItem {
  id: number
  name: string
  description: string
  createTime: string
}

export interface PositionForm {
  id?: number
  name: string
  description: string
}

export const getPositionList = (params: { page: number; pageSize: number; name?: string }) => {
  return axios.get<{ code: number; message: string; data: { list: PositionItem[]; total: number } }>('/api/position/list', { params })
}

export const addPosition = (data: Omit<PositionForm, 'id'>) => {
  return axios.post<{ code: number; message: string; data: PositionItem }>('/api/position/add', data)
}

export const updatePosition = (data: PositionForm) => {
  return axios.put<{ code: number; message: string; data: null }>('/api/position/update', data)
}

export const deletePosition = (id: number) => {
  return axios.delete<{ code: number; message: string; data: null }>(`/api/position/delete?id=${id}`)
}
