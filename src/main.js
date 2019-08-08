import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入vant组件库
import Vant from 'vant'
import 'vant/lib/index.css'
// 导入配置REM基准值依赖
import 'amfe-flexible'
// 注册到vue实例中
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
