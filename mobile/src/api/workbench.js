/**
 * 工作台相关 API
 */
import request from './request'

/** 获取待办事项列表（待审核/待执行/待复核） */
export const getTodos = () => request.get('/workbench/todos')

/** 获取统计图表数据（巡检完成率趋势、设备异常分布、本月工单统计） */
export const getStats = () => request.get('/workbench/stats')

/** 获取通知公告列表（最多10条，按发布时间倒序） */
export const getAnnouncements = () => request.get('/workbench/announcements')

/** 获取制度文档列表 */
export const getDocuments = () => request.get('/workbench/documents')
