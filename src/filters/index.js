
// 使用全局过滤器处理时间格式
import Vue from 'vue'
import dayjs from 'dayjs'
// 注册相对时间显示对应的格式
import relativeTime from 'dayjs/plugin/relativeTime'
// 导入中文格式时间包
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
Vue.filter('format', (value) => {
  return dayjs().to(dayjs(value))
})
