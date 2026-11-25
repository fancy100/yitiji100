import axios from 'axios'

export interface MenuItem {
  id: number
  title: string
  type: 'directory' | 'menu' | 'button'
  icon: string
  path: string
  component: string
  permission: string
  sort: number
  visible: number
  status: number
  parentId: number | null
  children?: MenuItem[]
}

export interface MenuForm {
  id?: number
  title: string
  type: 'directory' | 'menu' | 'button'
  icon: string
  path: string
  component: string
  permission: string
  sort: number
  visible: number
  status: number
  parentId: number | null
}

export const getMenuList = () => {
  return axios.get<{ code: number; message: string; data: MenuItem[] }>('/api/menu/list')
}

export const addMenu = (data: Omit<MenuForm, 'id'>) => {
  return axios.post<{ code: number; message: string; data: MenuItem }>('/api/menu/add', data)
}

export const updateMenu = (data: MenuForm) => {
  return axios.put<{ code: number; message: string; data: null }>('/api/menu/update', data)
}

export const deleteMenu = (id: number) => {
  return axios.delete<{ code: number; message: string; data: null }>(`/api/menu/delete?id=${id}`)
}

export const updateMenuStatus = (id: number, status: number) => {
  return axios.put<{ code: number; message: string; data: null }>('/api/menu/status', { id, status })
}
