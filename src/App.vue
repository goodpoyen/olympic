<template>
  <v-app v-show="loginShow">
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    loginShow: false
  }),

  async mounted () {
    const currentUrl = window.location.pathname

    if (currentUrl.includes('/login')) {
      this.loginShow = true
    }

    if (!await this.checkLogin()) {
      if (!currentUrl.includes('/login')) {
        location.href = '/login'
      }
    } else {
      this.loginShow = true
      if (currentUrl.includes('/login')) {
        location.href = '/manage'
      }
    }
  }
}
</script>
