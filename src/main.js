import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import GlobalConstant from './components/config/GlobalConstant.vue'
import './utils/token'

Vue.config.productionTip = false

Vue.prototype.GLOBAL = GlobalConstant

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
