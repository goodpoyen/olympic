<template>
  <v-app v-show="loginShow">
    <v-main>
      <router-view />
    </v-main>
    <v-footer dark padless>
      <v-card-text class="py-2 white--text text-center">
        台灣奧林匹亞 copyright © {{ new Date().getFullYear() }}
      </v-card-text>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    loginShow: false
  }),

  async mounted () {
    const currentUrl = window.location.pathname

    if (currentUrl === '/login') {
      this.loginShow = true
    }

    if (!await this.checkLogin()) {
      if (currentUrl !== '/login') {
        location.href = '/login'
      }
    } else {
      this.loginShow = true
      if (currentUrl === '/login') {
        location.href = '/manage'
      }
    }
  }
}
</script>
