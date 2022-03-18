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
		path: '/manage',
		name: 'manage',
		component: () => import('../views/manageView.vue'),
		children: [
			{
			  path: "/manage/signup",
			  name: "signup",
			  component: () => import("../components/signup.vue")
			},
			{
				path: "/manage/account",
				name: "account",
				component: () => import("../components/account.vue")
			  },
		]
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.VUE_APP_LOCALURL,
	routes
})

export default router
