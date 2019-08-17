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

//  获取点击搜索文章的详情
/**
 *
 * @param {*} id为文章的id
 */
export const getSearchArticle = (id) => {
  return request.get(`/app/v1_0/articles/${id}`)
}

// 对文章点赞
/**
 *
 * @param {*} id为文章的id
 */
export const likeArticles = (id) => {
  return request.post('/app/v1_0/article/likings', { target: id })
}

// 取消文章点赞
/**
 *
 * @param {*} id为文章的id
 */
export const unLikeArticles = (id) => {
  return request.delete(`/app/v1_0/article/likings/${id}`)
}

// 对文章不喜欢
/**
 *
 * @param {*} id为文章的id
 */
export const disLikesArticle = (id) => {
  return request.post('/app/v1_0/article/dislikes', { target: id })
}

// 取消对文章的不喜欢
/**
 *
 * @param {*} id为文章的id
 */
export const unDislikesArticle = (id) => {
  return request.delete(`/app/v1_0/article/dislikes/${id}`)
}
