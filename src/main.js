import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/plugins/element.js'
import axios from "axios";

Vue.config.productionTip = false

// 全局挂载axios
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/';
Vue.prototype.$http = axios;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
