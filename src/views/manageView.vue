<template>
	<div>
		
		<v-navigation-drawer v-model="drawer" app>
			<v-list>
				<v-list-item link>
					<v-list-item-content>
						<v-list-item-title class="text-h6">
							Poyen Liao
						</v-list-item-title>
						<v-list-item-subtitle>poyen@gmail.com</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
			</v-list>

			<v-divider></v-divider>

			<v-list>
				<v-list-group v-for="item in items" :key="item.title" v-model="item.active" :prepend-icon="item.action" no-action>
					<template v-slot:activator>
						<v-list-item-content>
							<v-list-item-title v-text="item.title"></v-list-item-title>
						</v-list-item-content>
					</template>

					<v-list-item v-for="child in item.items" :key="child.title" link>
						<v-list-item-content>
							<v-list-item-title v-text="child.title" @click="route(child.even, child.param)"></v-list-item-title>
						</v-list-item-content>
					</v-list-item>

				</v-list-group>
			</v-list>
		</v-navigation-drawer>

		<v-app-bar app>
			<v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
			<v-toolbar-title>台灣奧林匹亞</v-toolbar-title>
		</v-app-bar>

		<router-view></router-view>
	</div>	  
</template>

<script>
// import HelloWorld from '../components/HelloWorld'

export default {
	components: {

  	},
	data: () => ({
		drawer: null,
		items: [
			{
			action: 'mdi-cog',
			items: [
				{ title: '帳號管理', even: 'account'}
			],
			title: '管理項目',
			},
			{
			action: 'mdi-file-document-edit-outline',
			active: true,
			items: [
				{ title: '初選第一階段', even: 'signup', param : '1'},
				{ title: '初選第二階段', even: 'signup', param : '2' },
				{ title: '複選', even: 'signup', param : '3' },
			],
			title: '報名資訊',
			},
			// {
			// action: 'mdi-lightbulb-auto-outline',
			// items: [
			// 	{ title: '初選第一階段', even: 'signup' },
			// 	{ title: '初選第二階段', even: 'signup' },
			// 	{ title: '複選', even: 'signup' },
			// ],
			// title: '成績',
			// }
		],
    }),

    methods: {
		route(path, param) {
			if (path == 'account'){
				this.$router.push ({ path: '/manage/account'})
				// console.log(this.$router.path)
				window.history.pushState('page2', 'Title', '/manage/account');
			}

			if (path == 'signup'){
				this.$router.push ({ path: '/manage/signup', query: { id: param }})
				// console.log(this.$router.path)
				window.history.pushState('page2', 'Title', '/manage/signup?id=' + param);
			}

		},

		test() {
			console.log(55)
		}
    }

}
</script>