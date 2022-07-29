<template>
  <div>
    <v-navigation-drawer v-model="drawer" app>
      <v-list style="margin: -18px">
        <v-list-item link>
          <v-list-item-content>
            <v-list-item style="right: 2px">
              <v-list-item-avatar>
                <v-img
                  max-height="30"
                  max-width="30"
                  src="/images/logo.png"
                ></v-img>
              </v-list-item-avatar>
              <v-list-item-title
                class="text-h7"
                style="right: 9px; font-weight: bold; color: #0046fe"
              >
                {{ olympicTitle }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item style="left: 52px; margin-top: -22px">
              <v-list-item-subtitle>{{ olympicMsg }}</v-list-item-subtitle>
            </v-list-item>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list dense style="margin-top: 10px">
        <v-list-item-group v-model="selectedItem" color="primary">
          <v-list-item v-for="(item, i) in items" :key="i">
            <v-list-item-icon style="margin-top: 15px">
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content style="margin-top: 9px">
              <router-link
                :to="'/manage/' + item.even"
                style="
                  font-size: 13px;
                  font-weight: bold;
                  text-decoration: none;
                  color: black;
                "
              >
                {{ item.text }}
              </router-link>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar dark color="#0046FE" dense>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title style="font-size: 17px; font-weight: bold">
        {{titleName}}
      </v-toolbar-title>
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
    olympicTitle: '',
    olympicMsg: '',
    selectedItem: 0,
    items: [
      { text: '選拔管理', icon: 'mdi-calendar-text-outline', even: 'selection' },
      { text: '聯絡人管理', icon: 'mdi-briefcase-account-outline', even: 'schoolUser' },
      { text: '樣板上傳', icon: 'mdi-file-upload-outline' },
      { text: '系統管理', icon: 'mdi-cog-outline' }
    ],
    datetime: new Date()
  }),

  computed: {
    titleName () {
      if (this.$route.path === '/manage') {
        this.$store.dispatch('title', '選拔管理')
      }
      return this.$store.state.title
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
  }
}
</script>
