/**
 * 用户相关 API
 */
import request from './request'

/** 获取当前登录用户的个人信息 */
export const getUserProfile = () => request.get('/user/profile')
