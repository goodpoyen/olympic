import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    redirect: '/login',
    component: () => import('../views/loginView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/loginView.vue')
  },
  {
    path: '/forget',
    name: 'forget',
    component: () => import('../views/forgetView.vue')
  },
  {
    path: '/manage',
    name: 'manage',
    component: () => import('../views/manageView'),
    children: [
      {
        path: 'signup',
        name: 'signup',
        component: () => import('../components/signup')
      },
      {
        path: 'account',
        name: 'account',
        component: () => import('../components/account.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
