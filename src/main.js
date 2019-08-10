import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入vant组件库
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'
import '@/styles/index.less'
// 导入第三方插件验证规则并注册到vue实例中
import VeeValidate, { Validator } from 'vee-validate'
// 导入设置中文提示包
import zh from 'vee-validate/dist/locale/zh_CN'
// 导入配置REM基准值依赖
import 'amfe-flexible'
// 注册VeeValidate
Vue.use(VeeValidate, { events: 'blur' })
// 配置中文包
Validator.localize('zh_cn', zh)
// 注册到vue实例中
Vue.use(Vant)
// 注册图片懒加载到实例中
Vue.use(Lazyload)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
