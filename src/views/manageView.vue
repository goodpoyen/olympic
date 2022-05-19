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

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>選拔支援系統</v-toolbar-title>
    </v-app-bar>
    <!-- <v-card class="mx-auto" max-width="80%" tile style="margin-top: 10px">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">選拔代碼</th>
              <th class="text-left">類別</th>
              <th class="text-left">選拔名稱</th>
              <th class="text-left">報名時間</th>
              <th class="text-left">功能</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>A</td>
              <td>TOI</td>
              <td>2022台灣資訊奧林匹亞初選選拔賽</td>
              <td>2022/04/01 00:00 ~ 2022/04/14 23:59</td>
              <td>
                <v-btn
                  depressed
                  color="primary"
                  style="display: block; margin-top: 10px"
                  >考場設定</v-btn
                >
                <v-btn
                  depressed
                  color="primary"
                  style="display: block; margin-top: 10px"
                  >報名欄位設定</v-btn
                >
                <v-btn
                  depressed
                  color="primary"
                  style="display: block; margin-top: 10px"
                  >報名資料</v-btn
                >

                <v-btn
                  depressed
                  color="primary"
                  style="display: block; margin-top: 10px; margin-bottom: 10px"
                  >參賽資料</v-btn
                >
              </td>
            </tr>
            <tr>
              <td>A</td>
              <td>TOI</td>
              <td>2022台灣資訊奧林匹亞初選選拔賽</td>
              <td>2022/04/01 00:00 ~ 2022/04/14 23:59</td>
              <td>
                <v-btn
                  depressed
                  color="primary"
                  style="display: block; margin-top: 10px"
                  >考場設定</v-btn
                >
                <v-btn
                  depressed
                  color="primary"
                  style="display: block; margin-top: 10px"
                  >報名欄位設定</v-btn
                >
                <v-btn
                  depressed
                  color="primary"
                  style="display: block; margin-top: 10px"
                  >報名資料</v-btn
                >

                <v-btn
                  depressed
                  color="primary"
                  style="display: block; margin-top: 10px; margin-bottom: 10px"
                  >參賽資料</v-btn
                >
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card> -->
    <!-- <v-datetime-picker v-model="datetime"></v-datetime-picker> -->

    <router-view> </router-view>
  </div>
</template>

<script>
// import DatetimePicker from '../components/DatetimePicker'

export default {
  components: {
    // 'v-datetime-picker': DatetimePicker
  },
  data: () => ({
    drawer: null,
    olympicTitle: '',
    olympicMsg: '',
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
          { title: '選拔管理', even: 'signup', param: '1' }
        ],
        title: '選拔項目'
      }
    ],
    datetime: new Date()
  }),

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
