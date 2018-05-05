<template>
  <v-app>
    <v-content>
      <v-fade-transition>
        <router-view></router-view>
      </v-fade-transition>
    </v-content>
  </v-app>
</template>

<script>
  import {AUTH_SIGNOUT} from './store/actions/sidik'
  import axios from 'axios'

  export default {
    data () {
      return {}
    },
    name: 'App',
    created: function () {
      axios.interceptors.response.use(undefined, function (err) {
        return new Promise(function (resolve, reject) {
          if (err.status === 403 && err.config && !err.config.__isRetryRequest) {
            // if you ever get an unauthorized, logout the user
            this.$store.dispatch(AUTH_SIGNOUT)
            this.$router.push('/signin')
            // you can also redirect to /login if needed !
          }
          throw err
        })
      })
    }
  }
</script>
