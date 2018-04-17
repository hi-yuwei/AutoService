import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
/* eslint-disable */
export default new Router({
  routes: [
    {
      path: '/',
      name: "首页",
      component: resolve => require(['../components/index.vue'], resolve),
      children: [{
          path: 'service',
          name: '账户中心',
          component: resolve => require(['../components/service.vue'], resolve)
      }]
  }
  ]
})
/* eslint-disable */
