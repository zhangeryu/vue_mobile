import request from '@/utils/request.js'
// 获取联想建议
export const suggestion = (q) => {
  return request.get('/app/v1_0/suggestion', { params: { q } })
}

// 获取搜索结果信息数据
export const getSearchArticles = ({ page, perPage, q }) => {
  return request.get('/app/v1_0/search', {
    params: {
      page: page,
      per_page: perPage,
      q: q
    }
  })
}
