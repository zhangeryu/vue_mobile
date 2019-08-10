import request from '@/utils/request.js'
export const getChanneList = () => {
  return request.get('/app/v1_0/user/channels')
}
