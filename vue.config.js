const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    port: process.env.VUE_APP_LOCALPORT

    // proxy: {
    //   '/api': {
    //     target: process.env.VUE_APP_APISERVERURL,
    //     changOrigin: true,
    //     pathRewrite: {
    //       '^/api': ''
    //     }
    //   }
    // }
  },
  transpileDependencies: [
    'vuetify'
  ],
  productionSourceMap: false,
  lintOnSave: false,
  configureWebpack: {
    output: {
      filename: '[name].[hash:8].js'
      // chunkFilename: 'utils/[name].[hash:8].js'
    }
  },
  chainWebpack: config => {
    config.optimization.minimize(true)
    config.optimization.splitChunks({
      // minimize: true,
      chunks: 'all',
      maxInitialRequests: Infinity,
      maxSize: 20000,
      cacheGroups:
        {
          vendor:
          {
            reuseExistingChunk: true,
            test: /[\\/]node_modules[\\/]/,
            name (module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(/[\\/]node_modules[\\/]([^\\/]+)([\\/]|$)/)[1]

              // npm package names are URL-safe, but some servers don't like @ symbols
              return `vendor_${packageName.replace('@', '')}`
            }
          }
        }
    })
    config.plugins.delete('prefetch')
  }
})
