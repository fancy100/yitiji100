/**
 * 认证相关 API
 */
import request from './request'

/** 登录 */
export const login = (data) => request.post('/auth/login', data)
