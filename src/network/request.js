import Vue from 'vue'
import axios from "axios";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export default function request() {
  // 全局挂载axios
  axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/';
  Vue.prototype.$http = axios;
  // axios请求拦截器（request拦截器中展示进度条）
  axios.interceptors.request.use(res => {
    // 添加请求头字段Authorization
    res.headers.Authorization = window.sessionStorage.getItem('token');

    NProgress.start();
    return res;
  })
  // axios请求拦截器（response拦截器中展示进度条）
  axios.interceptors.response.use(res => {
    NProgress.done();
    return res;
  })
}





