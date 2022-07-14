import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import store from './store'
import GlobalConstant from './components/config/GlobalConstant.vue'
import './utils/token'
import './utils/tool'

Vue.config.productionTip = false

Vue.prototype.GLOBAL = GlobalConstant

Vue.prototype.axios = axios

axios.defaults.withCredentials = true

Vue.use(Vuex)

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
