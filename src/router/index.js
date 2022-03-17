import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/loginView.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_LOCALURL,
  routes
})

export default router
