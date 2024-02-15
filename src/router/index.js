import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken } from '../utils/token'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/index.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register/index.vue')
  },
  {
    path: '/layout',
    name: 'layout',
    redirect: '/layout/home',
    component: () => import('@/views/Dashboard/index.vue'),
    children: [
      {
        path: 'home',
        component: () => import('@/views/Home/index.vue')
      },
      {
        path: 'book',
        component: () => import('@/views/Book/index.vue')
      },
      {
        path: 'type',
        component: () => import('@/views/Type/index.vue')
      },
      {
        path: 'record',
        component: () => import('@/views/Record/index.vue')
      },
      {
        path: 'user',
        component: () => import('@/views/User/index.vue')
      },
      {
        path: 'comment',
        component: () => import('@/views/Comment/index.vue')
      },
      {
        path: 'message',
        component: () => import('@/views/Message/index.vue')
      },
      {
        path: 'me',
        component: () => import('@/views/Me/index.vue')
      }
    ]
  },
  {
    path: '*',
    component: () => import('@/views/NotFound/index.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由前置全局守卫（在路由发生真正跳转之前，会执行该函数）
router.beforeEach((to, from, next) => {
  // 如果用户访问登录页面直接放行
  if (to.path === '/login') return next()
  if (to.path === '/register') return next()
  // 如果没有token，强制跳转到登录页面
  if (!getToken()) {
    return next('/login')
  } else {
    // 有token放行
    next()
  }
})

export default router
