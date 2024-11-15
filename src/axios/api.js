import request from './index'
 
//获取用户信息接口
export const getLogs = (data) => request.get('/getLogs', { params: data })
export const Update_Escalated_Log = (data) => request.get('/update_escalated_log', { params: data })
export const getAlert = (data) => request.get('/getAlert', { params: data })
export const Update_Escalated = (data) => request.get('/update_escalated', { params: data })
export const getNodeLog = (data) => request.get('/getNodeLog', { params: data })
export const update_case_log = (data) => request.get('/update_case_log', { params: data })