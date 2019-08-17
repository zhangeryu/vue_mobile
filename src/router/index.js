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
    },
    {
      name: 'search',
      path: '/search',
      component: () => import(/* webpackChunkName: "search" */'@/views/search/index.vue')
    },
    {
      name: 'search-result',
      path: '/search-result/:q',
      props: true,
      component: () => import(/* webpackChunkName: "search-result" */'@/views/search-result/index.vue')
    },
    {
      name: 'articles',
      path: '/articles/:id',
      props: true,
      component: () => import(/* webpackChunkName: "article" */'@/views/articles/index.vue')
    }
  ]
})
