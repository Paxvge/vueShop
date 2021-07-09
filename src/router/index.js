import Vue from 'vue'
import VueRouter from 'vue-router'
// 懒加载
const Login = () => import('@/views/Login')
const Home = () => import('@/views/Home')
const Welcome = () => import('@/views/Welcome')
const User = () => import('@/components/user/User')

Vue.use(VueRouter)

const routes = [
  // 路由重定向
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: User
      },
    ]
  },
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  else next();
})



export default router
