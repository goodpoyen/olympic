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
    // path: '/login/:id',
    path: '/login',
    name: 'login',
    // props: true,
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
        path: 'signup/:id',
        name: 'signup',
        component: () => import('../components/signup.vue')
      },
      {
        path: 'selection',
        name: 'selection',
        component: () => import('../components/selection.vue')
      },
      {
        path: 'optionExam/:id',
        name: 'optionExam',
        props: true,
        component: () => import('../components/optionExam.vue')
      },
      {
        path: 'personnelInfo/:id',
        name: 'personnelInfo',
        props: true,
        component: () => import('../components/personnelInfo.vue')
      },
      {
        path: 'examArea/:id',
        name: 'examArea',
        props: true,
        component: () => import('../components/examArea.vue')
      },
      {
        path: 'classRoom/:id',
        name: 'classRoom',
        props: true,
        component: () => import('../components/classRoom.vue')
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
