<template>
  <v-app>
    <v-content>
      <v-fade-transition>
        <router-view></router-view>
      </v-fade-transition>
      <!--Snack bar-->
      <v-snackbar
        :timeout="interceptorSnackTimeout"
        :color="interceptorSnackColor"
        v-model="interceptorSnack"
        :multi-line="true"
      >
        {{ interceptorSnackMessage }}
        <v-btn dark flat @click.native="interceptorSnack = false">Close</v-btn>
      </v-snackbar>
    </v-content>
  </v-app>
</template>

<script>
  import {AUTH_SIGNOUT} from './store/actions/sidik'
  import axios from 'axios'

  export default {
    data () {
      return {
        // Snack for interceptor
        interceptorSnack: false,
        interceptorSnackMessage: '',
        interceptorSnackColor: '',
        interceptorSnackTimeout: 6000
      }
    },
    methods: {
      generateSnack: function (message, color) {
        this.interceptorSnackMessage = message
        this.interceptorSnackColor = color
        this.interceptorSnack = true
      }
    },
    name: 'App',
    created: function () {
      // Interceptor for expired or invalid token for user account
      axios.interceptors.response.use(undefined, err => {
        let res = err.response
        if (res.status === 401 && res.config && !res.config.__isRetryRequest && res.data.error.code === 1) {
          return new Promise((resolve, reject) => {
            // if you ever get an unauthorized, logout the user
            this.$store.dispatch(AUTH_SIGNOUT)
            this.$router.push('/signin')
            this.generateSnack(res.data.error.message, 'error')
          })
        } else if (res.status === 401 && res.config && !res.config.__isRetryRequest && res.data.error.code === 2) {
          return new Promise((resolve, reject) => {
            // if you ever get an unauthorized, logout the user
            this.$store.dispatch(AUTH_SIGNOUT)
            this.$router.push('/admin/signin')
            this.generateSnack(res.data.error.message, 'error')
          })
        }
        throw err
      })
    }
  }
</script>
