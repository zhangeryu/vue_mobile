
// 封装一个全局的检查用户是否登入的功能,并注册在Vue实例上
export default {
  // 自定义一个插件方法需要对外暴露一个install方法
  install (Vue, options) {
    // 在Vue实例原型对象上添加该方法
    Vue.prototype.$checkLogin = function () {
      // 在原型对象的方法处理判断用户是否登入的逻辑
      if (this.$store.state.user) {
        return true
      }
      // 没有登入则就提示用户
      this.$dialog.confirm({
        title: '登入提示',
        message: '该操作需要登入才可使用，是否需要登入？'
      }).then(() => {
        this.$router.push({
          name: 'login',
          query: { redirect: this.$route.fullPath }
        })
        // on confirm
      }).catch(() => {
        // on cancel
      })
      return false
    }
  }
}
