<template>
  <v-app id="inspire">
    <v-layout justify-space-around>
      <v-flex xs12 md3 mt-3>
        <v-card>
          <v-card-media src="/static/img/other/arduino-1050655_640.jpg" height="100px">
          </v-card-media>
          <v-card-title primary-title>
            <div>
              <img src="/static/img/logos/banner-toolbar.png" width="100" />
              <br/>
              <h3 class="headline mb-0">Sign in</h3>
              <div>Using your RumahIoT Credential</div>
            </div>
          </v-card-title>
          <v-container>
            <v-form v-model="formValid" ref="form" lazy-validation>
              <v-text-field
                name="email"
                label="Email Address"
                v-model="email"
                :rules="[() => !!email || 'Please type your e-mail address',() => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email) || 'Please enter valid e-mail address',() => email.length <= 254 || 'Email address cannot be longer than 254 character']"
                required
              ></v-text-field>
              <v-text-field
                name="password"
                label="Password"
                v-model="password"
                :append-icon="p1 ? 'visibility' : 'visibility_off'"
                :append-icon-cb="() => (p1 = !p1)"
                :type="p1 ? 'password' : 'text'"
                :rules="[() => !!password || 'Please type password for your RumahIoT account',() => password.length <= 50 || 'Password cannot be longer than 50 character']"
                counter
                required
              ></v-text-field>
              <div>
                <a class="body-1">Forgot your password ?</a>
                <br/>
              </div>
              <v-btn v-on:click="onSubmit" block :disabled="!formValid" large active-class color="primary">Sign in</v-btn>
            </v-form>

            <v-snackbar
              :timeout="signinSnackTimeOut"
              :color="signinSnackColor"
              v-model="signinSnack"
              :multi-line="true"
            >
              {{ signinSnackMessage }}
              <v-btn dark flat @click.native="signinSnack = false">Close</v-btn>
            </v-snackbar>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script>
  import {AUTH_REQUEST} from '../store/actions/sidik'

  export default {
    data () {
      return {
        formValid: false,
        email: '',
        password: '',
        // Show or hide password
        p1: true,
        // Snackbar
        signinSnack: false,
        signinSnackMessage: '',
        signinSnackColor: '',
        signinSnackTimeOut: 6000
      }
    },
    methods: {
      onSubmit: async function () {
        try {
          if (this.$refs.form.validate()) {
            // When the form is valid
            const {email, password} = this
            this.$store.dispatch(AUTH_REQUEST, {email, password})
              .then(() => {
                this.$router.push('/')
              })
              .catch((err) => {
                this.generateSnack(err.response.data.error.message, 'error')
              })
          }
        } catch (error) {
          // Display client error
          console.error(error)
        }
      },
      generateSnack (message, color) {
        this.signinSnackMessage = message
        this.signinSnackColor = color
        this.signinSnack = true
      }
    }
  }
</script>
