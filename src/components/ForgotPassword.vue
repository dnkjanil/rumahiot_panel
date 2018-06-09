<template>
  <v-app id="inspire">
    <v-layout justify-space-around>
      <v-flex xs12 md4 mt-3>
        <!--Submit new password-->
        <v-card v-if="forgotPasswordUUID">
          <v-card-media src="/static/img/other/arduino-1128227_640.jpg" height="100px">
          </v-card-media>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">Forgot your password?</h3>
              <br/>
              <div><strong>Enter a new password</strong> for your RumahIoT account.</div>
            </div>
          </v-card-title>
          <v-container>
            <v-form v-model="formResetValid" ref="formConfirm">
              <v-text-field
                name="new_password"
                label="New Password"
                v-model="newPassword"
                :append-icon="p1 ? 'visibility' : 'visibility_off'"
                :append-icon-cb="() => (p1 = !p1)"
                :type="p1 ? 'password' : 'text'"
                :rules="[() => !!newPassword || 'Please type password for your RumahIoT account',() => newPassword.length <= 50 || 'Password cannot be longer than 50 character', ()=> newPassword.length >= 8 || 'Password must be atleast 8 character']"
                counter
                required
              ></v-text-field>
              <v-text-field
                name="new_retype_password"
                label="New Password (Retype)"
                v-model="newPasswordRetype"
                :append-icon="p2 ? 'visibility' : 'visibility_off'"
                :append-icon-cb="() => (p2 = !p2)"
                :type="p2 ? 'password' : 'text'"
                :rules="[() => !!newPasswordRetype || 'Please retype your password',() => newPassword == newPasswordRetype || 'Passwords does not match',() => newPasswordRetype.length <= 50 || 'Password cannot be longer than 50 character', ()=> newPasswordRetype.length >= 8 || 'Password must be atleast 8 character']"
                counter
              ></v-text-field>
              <v-btn :disabled="!formResetValid" @click="onForgotPasswordConfirmationRequest(forgotPasswordUUID)" large active-class class="white--text" color="teal">Reset my password </v-btn>
            </v-form>
            <v-snackbar
              :timeout="forgotSnackTimeOut"
              :color="forgotSnackColor"
              v-model="forgotSnack"
              :multi-line="true"
            >
              {{ forgotSnackMessage }}
              <v-btn dark flat @click.native="forgotSnack = false">Close</v-btn>
            </v-snackbar>
          </v-container>
        </v-card>
        <!--Forgot password request-->
        <v-card v-else>
          <v-card-media src="/static/img/other/arduino-1128227_640.jpg" height="100px">
          </v-card-media>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">Forgot Your Password ?</h3>
              <br/>
              <div><strong>Enter your email address to reset your password.</strong>  You may need to check your spam folder or unblock <strong>security@rumahiot.panjatdigital.com</strong>.</div>
            </div>
          </v-card-title>
          <v-container>
            <v-form v-model="formValid" ref="form">
              <v-text-field
                name="email"
                label="Email Address"
                v-model="email"
                :rules="[() => !!email || 'Please type your e-mail address',() => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email) || 'Please enter valid e-mail address',() => email.length <= 254 || 'Email address cannot be longer than 254 character']"
                required
              ></v-text-field>
              <vue-recaptcha  ref="invisibleRecaptcha"
                              @verify="onVerify"
                              @expired="onExpired"
                              size="invisible"
                              :sitekey=sitekey>
                <v-btn :disabled="!formValid" large active-class class="white--text" color="teal">Reset my password </v-btn>
              </vue-recaptcha>
            </v-form>
            <v-snackbar
              :timeout="forgotSnackTimeOut"
              :color="forgotSnackColor"
              v-model="forgotSnack"
              :multi-line="true"
            >
              {{ forgotSnackMessage }}
              <v-btn dark flat @click.native="forgotSnack = false">Close</v-btn>
            </v-snackbar>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script>
  import VueRecaptcha from 'vue-recaptcha'
  import {FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_CONFIRMATION_REQUEST} from '../store/actions/sidik'

  export default {
    data: () => {
      return {
        // show/hide password icon
        p1: true,
        p2: true,
        formValid: false,
        formResetValid: false,
        newPassword: '',
        newPasswordRetype: '',
        email: '',
        password: '',
        retypePassword: '',
        // Snackbar
        forgotSnack: false,
        forgotSnackMessage: '',
        forgotSnackColor: '',
        // Invisible recaptcha site key
        sitekey: '6Lf7OUIUAAAAAM56DMwL4YqZB77RRS9SYolHllM7',
        forgotSnackTimeOut: 6000
      }
    },
    methods: {
      onForgotPasswordConfirmationRequest: async function (forgotPasswordUUID) {
        try {
          if (this.$refs.formConfirm.validate()) {
            const data = {
              newPassword: this.newPassword,
              newPasswordRetype: this.newPasswordRetype,
              forgotPasswordUUID: forgotPasswordUUID
            }
            this.$store.dispatch(FORGOT_PASSWORD_CONFIRMATION_REQUEST, data)
              .then(resp => {
                this.generateSnack(resp.data.success.message, 'success')
              })
              .catch(err => {
                this.generateSnack(err.response.data.error.message, 'error')
              })
          }
        } catch (err) {
          console.error(err)
        }
      },
      onForgotPasswordRequest: async function (recaptchaResponse) {
        try {
          if (this.$refs.form.validate()) {
            const data = {
              email: this.email,
              recaptchaResponse: recaptchaResponse
            }
            this.$store.dispatch(FORGOT_PASSWORD_REQUEST, data)
              .then(resp => {
                this.generateSnack(resp.data.success.message, 'success')
              })
              .catch(err => {
                this.generateSnack(err.response.data.error.message, 'error')
              })
          }
        } catch (err) {
          console.error(err)
        }
      },
      generateSnack (message, color) {
        this.forgotSnackMessage = message
        this.forgotSnackColor = color
        this.forgotSnack = true
      },
      onVerify (response) {
        this.onForgotPasswordRequest(response)
        this.resetRecaptcha()
      },
      onExpired () {
        this.generateSnack('Recaptcha Expired, please refresh the page')
      },
      resetRecaptcha () {
        this.$refs.invisibleRecaptcha.reset() // Direct call reset method
      }
    },
    components: { VueRecaptcha },
    computed: {
      forgotPasswordUUID: function () {
        return this.$route.query.reset
      }
    }
  }
</script>

