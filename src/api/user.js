
// 封装请求的api方法
import request from '@/utils/request.js'
export const login = ({ mobile, code }) => {
  return request.post('/app/v1_0/authorizations', { mobile, code })
}
