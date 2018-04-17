// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import IScrollView from 'vue-iscroll-view'
import axios from 'axios'
import Public from './js/public'

/* Using these kinds of IScroll class for different cases. */
import IScroll from 'iscroll'
Vue.use(IScrollView, IScroll)

Vue.prototype.$axios = axios;
Vue.prototype.$public = Public;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
