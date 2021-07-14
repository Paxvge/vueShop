import Vue from 'vue'
import VueRouter from 'vue-router'
// 懒加载
const Login = () => import('@/views/Login')
const Home = () => import('@/views/Home')
const Welcome = () => import('@/views/Welcome')
const Users = () => import('@/components/user/User')
const Rights = () => import('@/components/power/Rights')
const Roles = () => import('@/components/power/Roles')
const Cate = () => import('@/components/goods/Cate')
const Params = () => import('@/components/goods/Params')
const GoodsList = () => import('@/components/goods/List')
const Add = () => import('@/components/goods/Add')
const Order = () => import('@/components/order/Order')
const Report = () => import('@/components/report/Report')

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
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: GoodsList
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/orders',
        component: Order
      },
      {
        path: '/reports',
        component: Report
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
