import request from '@/utils/request.js'
// 服务器接口需要的参数以对象形式传参
export const getArticles = ({ channelId, timestamp, withTop = 1 }) => {
  return request.get('/app/v1_1/articles', {
    params: {
      channel_id: channelId,
      timestamp: timestamp,
      with_top: withTop
    }
  })
}

/**
 * 不感兴趣的文章
 * id 为当前点击x号的id
 */
export const dislikeArticle = (id) => {
  return request.post('/app/v1_0/article/dislikes', { target: id })
}

// 举报文章
export const reportArticle = ({ id, type }) => {
  return request.post('/app/v1_0/article/reports', { target: id, type: type })
}
