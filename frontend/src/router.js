import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Login from './components/auth/Login.vue'
import Upload from './components/asignacion/Upload.vue'
Vue.use(Router)

let router = new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'home',
        component: Login
      },
      {
        path: '/asignacion/:client',
        name: 'asignacion',
        component: Upload,
        props: true,
        meta: { 
            requiresAuth: true
        }
      },
    ]
})
router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters.isLoggedIn) {
            console.log()
            next()
            return
        }
        next('/') 
    } else {
        next()
    }
})
export default router