// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import axios from 'axios'
import CripVueLoading from 'crip-vue-loading'
import store from '@/store'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(Vuetify)

// Gmaps
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCEtcrfWWhc3uP_sdPNnk-2ZoILF5OP46U',
    libraries: 'places'
  }
})

// For global token accross axios
const token = localStorage.getItem('rumahiot-token')
if (token) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
}
// Loading Script
Vue.use(CripVueLoading, {
  axios: axios,
  // Default color of loader
  color: '#039BE5',
  // Loader color when request fails
  failColor: '#ac2925',
  // Height of loader
  height: '4px'
})

Vue.config.productionTip = false
/* Router title */
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
