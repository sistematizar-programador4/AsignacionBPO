import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import axios from 'axios'
import store from './store'

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://localhost:3000/api'
axios.defaults.withCredentials = true
axios.defaults.headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}
new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
