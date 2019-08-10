// 使用公共模块将返回的token和refresh_toke封装保存在一个函数中，到时候哪个组件使用就导入并调用该方法
// 由于服务器返回的数据是一个json字符串对象，而将数据保存到localStorage时则是以js对象保存的
// 所以需要使用JSON.parse来进行转换

// 获取token信息
export const getUser = () => JSON.parse(window.localStorage.getItem('user'))

// 设置token
export const setUser = (data) => window.localStorage.setItem('user', JSON.stringify(data))

// 移除token
export const removeUser = () => window.localStorage.removeItem('user')
