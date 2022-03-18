<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
     <v-footer dark padless>
       <v-card-text class="py-2 white--text text-center">
        台灣奧林匹亞 copyright © {{ new Date().getFullYear() }} 
      </v-card-text></v-footer>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
    drawer: null,
  })
}
</script>
