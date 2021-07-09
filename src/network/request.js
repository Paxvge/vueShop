import Vue from 'vue'
import axios from "axios";

export function request() {
  // 全局挂载axios
  axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/';
  Vue.prototype.$http = axios;
  // axios请求拦截器
  axios.interceptors.request.use(res => {
    // 添加请求头字段Authorization
    res.headers.Authorization = window.sessionStorage.getItem('token');
    return res;
  })
}





