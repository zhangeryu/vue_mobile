
// 封装请求的api方法
import request from '@/utils/request.js'
export const login = ({ mobile, code }) => {
  return request.post('/app/v1_0/authorizations', { mobile, code })
}

// 封装拉黑作者的api方法
export const blackAuth = (id) => {
  return request.post('/app/v1_0/user/blacklists', {target: id})
}
