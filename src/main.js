import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import GlobalConstant from './components/config/GlobalConstant.vue'
import './utils/token'
import './utils/tool'

Vue.config.productionTip = false

Vue.prototype.GLOBAL = GlobalConstant

Vue.prototype.axios = axios

axios.defaults.withCredentials = true

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
