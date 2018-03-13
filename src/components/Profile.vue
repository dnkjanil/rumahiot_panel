<template>
  <v-layout justify-space-around wrap>
    <v-flex xs12 md3 mt-3 >
      <v-card>
        <div>
          <!--Profile tab-->
          <v-tabs icons-and-text centered dark color="blue">
            <v-tabs-slider color="yellow"></v-tabs-slider>
            <v-tab href="#general-profile">
              General
              <v-icon>fa-street-view</v-icon>
            </v-tab>
            <v-tab href="#change-password">
              Password
              <v-icon>fa-user-secret</v-icon>
            </v-tab>
            <!--Tab content-->
            <v-tab-item id="general-profile">
              <v-card flat>
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">Change Your Profile Data</h3>
                  </div>
                </v-card-title>
                <v-container>
                <!--Profile Image-->
                  <v-layout row wrap>
                    <v-flex xs6>
                      <v-avatar
                        tile="false"
                        :size="150"
                        class="grey lighten-4"
                      >
                        <img src="https://s3-ap-southeast-1.amazonaws.com/rumahiot-upload/image/profile/5083b3ed6d4341ff9d9a6f4f649f1f31/42bbacdade4c4f7887fbf8ada2e29aeb.png" alt="avatar">
                      </v-avatar>
                    </v-flex>
                    <v-flex xs3>
                      <v-btn v-on:click="onChangePassword" :disabled="!changePasswordFormValid" small active-class color="primary">
                        Browse Picture
                      </v-btn>
                      <v-btn v-on:click="onChangePassword" :disabled="!changePasswordFormValid" small active-class color="primary">
                        Update Picture
                      </v-btn>
                    </v-flex>
                  </v-layout>
                  <br>
                  <v-divider></v-divider>
                  <br>
                  <!--Update profile-->
                  <v-form v-model="updateProfileFormValid" ref="updateProfileForm" lazy-validation>
                    <v-text-field
                      name="email"
                      label="Your email address"
                      :value="userEmail"
                      disabled
                    ></v-text-field>
                    <v-text-field
                      name="full_name"
                      label="Full Name"
                      v-model="userFullName"
                      :rules ="[() => !!userFullName || 'Please type your full name',() => userFullName.length <= 70 || 'Full name cannot be longer than 70 character']"
                      :counter="70"
                      :value="userFullName"
                      required
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="phone"
                      name="phone_number"
                      label="Phone Number"
                      v-model="userPhoneNumber"
                      :rules ="[() => !!userPhoneNumber || 'Phone number field can not leaved empty', () => userPhoneNumber.length <= 15 || 'Phone Number cannot be longer than 15 character']"
                      :counter="15"
                      :value="userPhoneNumber"
                    ></v-text-field>

                    <v-btn v-on:click="onUpdateProfile" block :disabled="!updateProfileFormValid" large active-class color="primary">
                      Update Profile
                    </v-btn>
                  </v-form>
                  <!--Snack bar-->
                  <v-snackbar
                    :timeout="profileSnackTimeOut"
                    :color="profileSnackColor"
                    v-model="profileSnack"
                    :multi-line="true"
                  >
                    {{ profileSnackMessage }}
                    <v-btn dark flat @click.native="profileSnack = false">Close</v-btn>
                  </v-snackbar>
                </v-container>
              </v-card>
            </v-tab-item>
            <v-tab-item id="change-password">
              <v-card flat>
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">Change Your Password</h3>
                  </div>
                </v-card-title>
                <v-container>
                  <v-form v-model="changePasswordFormValid" ref="changePasswordForm" lazy-validation>
                    <v-text-field
                      name="old_password"
                      label="Old Password"
                      v-model="oldPassword"
                      :append-icon="p1 ? 'visibility' : 'visibility_off'"
                      :append-icon-cb="() => (p1 = !p1)"
                      :type="p1 ? 'password' : 'text'"
                      :rules="[() => !!oldPassword || 'Please type your old password',() => oldPassword.length <= 50 || 'Password cannot be longer than 50 character']"
                      counter
                      required
                    ></v-text-field>
                    <br>
                      Use at least 8 character and do not use a password from another site, or something that is too obvious
                    <br>
                    <v-text-field
                      name="new_password"
                      label="New Password"
                      v-model="newPassword"
                      :append-icon="p2 ? 'visibility' : 'visibility_off'"
                      :append-icon-cb="() => (p2 = !p2)"
                      :type="p2 ? 'password' : 'text'"
                      :rules="[() => !!newPassword || 'Please enter your new password',() => newPassword.length <= 50 || 'Password cannot be longer than 50 character']"
                      counter
                      required
                    ></v-text-field>
                    <v-text-field
                      name="new_password_retype"
                      label="New Password (Retype)"
                      v-model="newPasswordRetype"
                      :append-icon="p3 ? 'visibility' : 'visibility_off'"
                      :append-icon-cb="() => (p3 = !p3)"
                      :type="p3 ? 'password' : 'text'"
                      :rules="[() => !!newPasswordRetype || 'Please retype your new password',() => newPassword == newPasswordRetype || 'Passwords does not match',() => newPasswordRetype.length <= 50 || 'Password cannot be longer than 50 character']"
                      counter
                      required
                    ></v-text-field>
                    <v-btn v-on:click="onChangePassword" block :disabled="!changePasswordFormValid" large active-class color="primary">
                      Change Password
                    </v-btn>
                  </v-form>
                  <!--Snack bar-->
                  <v-snackbar
                    :timeout="profileSnackTimeOut"
                    :color="profileSnackColor"
                    v-model="profileSnack"
                    :multi-line="true"
                  >
                    {{ profileSnackMessage }}
                    <v-btn dark flat @click.native="profileSnack = false">Close</v-btn>
                  </v-snackbar>
                </v-container>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
  import {CHANGE_PASSWORD_REQUEST, AUTH_SIGNOUT} from '../store/actions/sidik'
  import {USER_PROFILE_REQUEST, USER_PROFILE_UPDATE_REQUEST} from '../store/actions/lemari'

  export default {
    data () {
      return {
        // Profile Data
        userEmail: '',
        userFullName: '',
        userPhoneNumber: '',
        changePasswordFormValid: false,
        updateProfileFormValid: false,
        oldPassword: '',
        newPassword: '',
        newPasswordRetype: '',
        // Show or hide password
        p1: true,
        p2: true,
        p3: true,
        // Snackbar
        profileSnack: false,
        profileSnackMessage: '',
        profileSnackColor: '',
        profileSnackTimeOut: 6000
      }
    },
    methods: {
      onChangePassword: async function () {
        try {
          if (this.$refs.changePasswordForm.validate()) {
            // When the form is valid
            const { oldPassword, newPassword, newPasswordRetype } = this
            this.$store.dispatch(CHANGE_PASSWORD_REQUEST, { oldPassword, newPassword, newPasswordRetype })
              .then((resp) => {
                this.generateSnack(resp.data.success.message, 'success')
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
      onUpdateProfile: async function () {
        try {
          if (this.$refs.updateProfileForm.validate()) {
            // When the form is valid
            const { userFullName, userPhoneNumber } = this
            this.$store.dispatch(USER_PROFILE_UPDATE_REQUEST, { userFullName, userPhoneNumber })
              .then((resp) => {
                this.generateSnack(resp.data.success.message, 'success')
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
        this.profileSnackMessage = message
        this.profileSnackColor = color
        this.profileSnack = true
      }
    },
    mounted: async function () {
      try {
        this.$store.dispatch(USER_PROFILE_REQUEST)
          .then((resp) => {
            // TODO: Take this from state instead
            // Put profil data in the form
            this.userFullName = resp.data.data.full_name
            this.userEmail = resp.data.data.email
            this.userPhoneNumber = resp.data.data.phone_number
          })
          .catch(() => {
            this.$store.dispatch(AUTH_SIGNOUT)
              .then(() => {
                this.$router.push('/signin')
              })
          })
      } catch (error) {
        // Display client error
        console.error(error)
      }
    }
  }
</script>
