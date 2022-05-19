import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    redirect: '/manage'
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
    component: () => import('../views/manageView.vue'),
    children: [
      {
        path: 'signup',
        name: 'signup',
        component: () => import('../components/signup.vue')
      },
      {
        path: 'account',
        name: 'account',
        component: () => import('../components/account.vue')
      },
      {
        path: 'schoolUser',
        name: 'schoolUser',
        component: () => import('../components/schoolUser.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
