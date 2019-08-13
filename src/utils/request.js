
// 封装request请求模块
import axios from 'axios'

// 导入vuex模块
import store from '@/store/'

// 导入处理大数字的依赖
import JSONBigint from 'json-bigint'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})

//  使用请求拦截器和响应拦截器对提交或返回的数据进行处理
//  请求拦截器中判断用户是否有登入过
request.interceptors.request.use(function (config) {
// 通过获取vuex中是否存在token，有token就代表用户已经有登入过
  if (store.state.user) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 在响应拦截器返回数据之前将一些浏览器无法读取的数据进行处理，例如大数字的处理
request.defaults.transformResponse = [function (data) {
  try {
    return JSONBigint.parse(data)

  } catch(err) {
    return data
  }
}]

// 使用响应拦截器对服务器返回的数据进行处理
request.interceptors.response.use(function (response) {
  // 进一步处理响应回来的数据
  return response.data.data || response.data
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})
// 将封装的request请求模块导出
export default request
