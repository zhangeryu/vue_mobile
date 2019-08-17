import request from '@/utils/request.js'
export const getChanneList = () => {
  return request.get('/app/v1_0/user/channels')
}

//  获取用户所有的频道列表
export const getAllchannels = () => {
  return request.get('/app/v1_0/channels')
}

//  删除用户对应的频道
export const deleteUserChannel = (id) => {
  return request.delete(`/app/v1_0/user/channels/${id}`)
}

//  添加用户点击的频道
/**
 *
 * @param {*} channels 需要传入一个数组 [{id: 1, seq: 2}]
 */
export const addUserChannel = (channels) => {
  return request.post('/app/v1_0/user/channels', {
    channels
  })
}

// 部分覆盖用户之前已经选择过的频道
export const updateUserChannel = (channels) => {
  return request.patch('/app/v1_0/user/channels', {
    channels
  })
}
