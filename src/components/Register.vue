<template>
  <v-app id="inspire">
    <v-layout justify-space-around>
      <v-flex xs12 md4 mt-3>
        <v-card>
          <v-card-media src="/static/img/other/technology-3092486_640.jpg" height="100px">
          </v-card-media>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">Register on RumahIoT</h3>
              <br/>
              <div><strong>With RumahIoT</strong> you don't need to think about deployment and data management on your IoT device, we will <strong>provide you the best way</strong> to do it, so you can <strong>focused on creating amazing things</strong></div>
            </div>
          </v-card-title>
          <v-container>
            <v-form v-model="formValid" ref="form">
              <v-text-field
                name="full_name"
                label="Full Name"
                v-model="fullName"
                :rules ="[() => !!fullName || 'Please type your full name',() => fullName.length <= 70 || 'Full name cannot be longer than 70 character']"
                :counter="70"
                required
              ></v-text-field>
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
                :rules="[() => !!password || 'Please type password for your RumahIoT account',() => password.length <= 50 || 'Password cannot be longer than 50 character', ()=> password.length >= 8 || 'Password must be atleast 8 character']"
                counter
                required
              ></v-text-field>
              <v-text-field
                name="retype_password"
                label="Password (Retype)"
                v-model="retypePassword"
                :append-icon="p2 ? 'visibility' : 'visibility_off'"
                :append-icon-cb="() => (p2 = !p2)"
                :type="p2 ? 'password' : 'text'"
                :rules="[() => !!retypePassword || 'Please retype your password',() => password == retypePassword || 'Passwords does not match',() => retypePassword.length <= 50 || 'Password cannot be longer than 50 character', ()=> retypePassword.length >= 8 || 'Password must be atleast 8 character']"
                counter

              ></v-text-field>
              <vue-recaptcha  ref="invisibleRecaptcha"
                              @verify="onVerify"
                              @expired="onExpired"
                              size="invisible"
                              :sitekey=sitekey>
                <v-btn block :disabled="!formValid" large active-class class="white--text" color="teal">Register</v-btn>
              </vue-recaptcha>
            </v-form>
            <v-snackbar
              :timeout="registrationSnackTimeOut"
              :color="registrationSnackColor"
              v-model="registrationSnack"
              :multi-line="true"
            >
              {{ registrationSnackMessage }}
              <v-btn dark flat @click.native="registrationSnack = false">Close</v-btn>
            </v-snackbar>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script>
  import axios from 'axios'
  import VueRecaptcha from 'vue-recaptcha'
  export default {
    data: () => {
      return {
        // show/hide password icon
        p1: true,
        p2: true,
        formValid: false,
        fullName: '',
        email: '',
        password: '',
        retypePassword: '',
        // Invisible recaptcha site key
        sitekey: '6Lf7OUIUAAAAAM56DMwL4YqZB77RRS9SYolHllM7',
        // Snackbar
        registrationSnack: false,
        registrationSnackMessage: '',
        registrationSnackColor: '',
        registrationSnackTimeOut: 6000
      }
    },
    methods: {
      async onSubmit (recaptchaResponse) {
        try {
          if (this.$refs.form.validate()) {
            var methodsScope = this
            const emailRegistrationEndpoint = 'https://sidik.rumahiot.panjatdigital.com/authenticate/email/register'
            const fd = new FormData()
            fd.append('full_name', this.fullName)
            fd.append('email', this.email)
            fd.append('password', this.password)
            fd.append('retype_password', this.retypePassword)
            fd.append('g-recaptcha-response', recaptchaResponse)
            axios.post(emailRegistrationEndpoint, fd)
              .then(function (response) {
                methodsScope.generateSnack(response.data.success.message, 'success')
              }, function (error) {
                methodsScope.generateSnack(error.response.data.error.message, 'error')
              })
          }
        } catch (error) {
          console.error(error)
        }
      },
      onVerify (response) {
        this.onSubmit(response)
        this.resetRecaptcha()
      },
      onExpired () {
        console.log('Expired')
      },
      resetRecaptcha () {
        this.$refs.invisibleRecaptcha.reset() // Direct call reset method
      },
      generateSnack (message, color) {
        this.registrationSnackMessage = message
        this.registrationSnackColor = color
        this.registrationSnack = true
      }
    },
    components: { VueRecaptcha }
  }
</script>

