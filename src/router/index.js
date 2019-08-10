import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({

  routes: [
    {
      path: '/',
      component: () => import('@/views/login/index.vue')
    },
    {
      name: 'login',
      path: '/login',
      component: () => import(/* webpackChunkName: "login" */'@/views/login/index.vue')
    },
    {
      name: 'layout',
      path: '/',
      component: () => import(/* webpackChunkName: "layout" */'@/views/layout/index.vue'),
      children: [
        {
          name: 'home',
          path: '/home',
          component: () => import(/* webpackChunkName: "home" */'@/views/home/index.vue')
        }
      ]
    }
  ]
})
