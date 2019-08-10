import Vue from 'vue'
import Vuex from 'vuex'
// 将获取到的token信息使用vuex保存在状态管理系统以便后期组件之间的共享使用该信息
import * as auth from '@/utils/author.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: auth.getUser()
  },
  mutations: {
    setUser (state, data) {
      state.user = data
      auth.setUser(data)
    }
  },
  actions: {

  }
})
