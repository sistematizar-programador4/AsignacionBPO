import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import axios from 'axios'
import store from './store'
import router from './router'

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://localhost:3000/api'
axios.defaults.headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}
const token = localStorage.getItem('token')
if (token) {
  axios.interceptors.request.use(function (config) {
      config.headers.Authorization =  localStorage.getItem('token');
      return config;
  });
}
console.log(token)
new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
