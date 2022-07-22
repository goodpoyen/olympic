<template>
  <div>
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              {{ olympicTitle }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ olympicMsg }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-list-group
          v-for="item in items"
          :key="item.title"
          v-model="item.active"
          :prepend-icon="item.action"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item v-for="child in item.items" :key="child.title" link>
            <v-list-item-content>
              <v-list-item-title
                v-text="child.title"
                @click="route(child.even, child.param)"
              ></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar dark color="#0046FE" dense>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ currentRouteName }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="logout">
        <v-icon>mdi-export</v-icon>
      </v-btn>
    </v-app-bar>
    <router-view> </router-view>
  </div>
</template>

<script>
export default {
  data: () => ({
    // drawer: null,
    olympicTitle: '',
    olympicMsg: '',
    // currentRouteName: '',
    items: [
      {
        action: 'mdi-cog',
        items: [
          { title: '帳號管理', even: 'account' },
          { title: '學校承辦人管理', even: 'schoolUser' }
        ],
        title: '管理項目'
      },
      {
        action: 'mdi-file-document-edit-outline',
        active: true,
        items: [
          { title: '選拔管理', even: 'selection', param: '1' }
        ],
        title: '選拔項目'
      }
    ],
    datetime: new Date()
  }),

  computed: {
    currentRouteName () {
      let title

      if (this.$route.name === 'account') {
        title = '帳號管理'
      }

      if (this.$route.name === 'schoolUser') {
        title = '承辦人資料管理'
      }

      return title
    }
  },

  methods: {
    route (path, param) {
      if (path === 'account') {
        this.$router.push({ path: '/manage/account' })
        // console.log(this.$router.path)
        // window.history.pushState('page2', 'Title', '/manage/account');
      }

      if (path === 'signup') {
        this.$router.push({ path: '/manage/signup', query: { id: param } })
        // console.log(this.$router.path)
        // window.history.pushState('page2', 'Title', '/manage/signup?id=' + param);
      }

      if (path === 'schoolUser') {
        this.$router.push({ path: '/manage/schoolUser' })
        // console.log(this.$router.path)
        // window.history.pushState('page2', 'Title', '/manage/account');
      }

      if (path === 'selection') {
        this.$router.push({ path: '/manage/selection' })
        // console.log(this.$router.path)
        // window.history.pushState('page2', 'Title', '/manage/account');
      }
    },

    logout () {
      localStorage.removeItem('ret')
      localStorage.removeItem('act')
      localStorage.removeItem('level')
      localStorage.removeItem('olympic')
      location.href = '/login'
    }
  },

  async mounted () {
    if (this.level.value === '2') {
      this.$delete(this.items[0].items, 0)
    }
    this.olympicTitle = await this.changeOlympicData(this.olympic.value)
    this.olympicMsg = await this.changeOlympicMsg(this.level.value)
    await this.renewLT()
    // this.$store.dispatch('test', 'balabala')
    // console.log(this.$store.state.test)
  }
}
</script>
