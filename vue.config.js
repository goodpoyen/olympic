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
	// publicPath: "olympic",
	productionSourceMap: false,
	lintOnSave:false,
	// configureWebpack: (config) => {
	// 	// 增加 iview-loader
	// 	config.module.rules[0].use.push({
	// 		loader: 'iview-loader',
	// 		options: {
	// 			prefix: false
	// 		}
	// 	})
	// 	// 在命令行使用 vue inspect > o.js 可以檢查修改後的webpack配置文件
	// }
})