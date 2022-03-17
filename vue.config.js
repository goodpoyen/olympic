const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    port: process.env.VUE_APP_LOCALPORT,

    proxy: {
      '/api': {
        target: process.env.VUE_APP_APISERVERURL, 
        changOrigin: true,
        pathRewrite: {
        '^/api': ''
        }
      }
    }
  },
  transpileDependencies: [
    'vuetify'
  ],

  lintOnSave:false,
})