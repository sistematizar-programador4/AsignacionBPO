import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    user : {},
    units: {}
  },
  mutations: {
    auth_request(state){
      state.status = 'loading'
    },
    auth_success(state, payload){
      state.status = 'success'
      state.token = payload.token
      state.user = payload.user
      state.units = payload.units
      console.log(payload)
    },
    auth_error(state){
      state.status = 'error'
    },
    logout(state){
      state.status = ''
      state.token = ''
      state.units = {}  
    },
  },
  actions: {
    login({commit}, user){
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios.post('/auth/signin',{username:user.email,password:user.password, client:user.client})
        .then(resp => {
          let token = resp.data.token
          let user = resp.data.user
          let units = resp.data.unitsRecord
          console.log(units)
          console.log(user)
          localStorage.setItem('token', token)
          let payload = {'token':token,'user':user,'units': units}
          commit('auth_success', payload)
          resolve(resp)
        })
        .catch(err => {
          commit('auth_error')
          localStorage.removeItem('token')
          reject(err)
        })
      })
    }
  },
  getters : {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    unitUser: state => state.units,
    user: state => state.user
  }
})
