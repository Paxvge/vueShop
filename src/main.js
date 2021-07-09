import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/plugins/element.js'
import {request} from '@/network/request'


Vue.config.productionTip = false

// 网络请求
request();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
