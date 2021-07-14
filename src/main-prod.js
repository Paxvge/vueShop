import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import request from '@/network/request'
import TreeTable from 'vue-table-with-tree-grid'
import dateFilter from "@/assets/js/dateFilter";

Vue.config.productionTip = false

// 网络请求
request()

Vue.component('tree-table', TreeTable)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
