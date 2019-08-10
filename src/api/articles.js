import request from '@/utils/request.js'
// 服务器接口需要的参数以对象形式传参
export const getArticles = ({
  channelId,
  timestamp,
  withTop = 1
}) => {
  return request.get('/app/v1_1/articles', {
    params: {
      channel_id: channelId,
      timestamp: timestamp,
      with_top: withTop
    }
  })
}
