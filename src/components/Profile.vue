<template>
  <v-layout justify-space-around wrap>
    <v-flex xs12 sm9 mt-3>
      <v-card>
        <!--Profile tab-->
        <v-tabs icons-and-text centered dark color="blue">
          <v-tabs-slider color="yellow"></v-tabs-slider>
          <v-tab href="#general-profile">
            General
            <v-icon>fa-street-view</v-icon>
          </v-tab>
          <v-tab href="#wireless-network">
            Wireless Network
            <v-icon>network_wifi</v-icon>
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
              <v-container grid-list-xl fluid>
                <v-layout wrap>
                  <v-flex xs12 sm3>
                    <v-avatar
                      tile
                      :size="190"
                      class="grey lighten-4"
                    >
                      <img :src="computedUserProfileImage" alt="avatar">
                    </v-avatar>
                    <v-btn v-on:click="onUpdateProfile" active-class small=""
                           color="primary">
                      Change Profile Picture
                    </v-btn>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <!--Update profile-->
                    <v-form v-model="updateProfileFormValid" ref="updateProfileForm" lazy-validation>
                      <v-text-field
                        append-icon="mail"
                        name="email"
                        label="Your email address"
                        :value="computedUserEmail"
                        disabled
                      ></v-text-field>
                      <v-text-field
                        name="full_name"
                        label="Full Name"
                        v-model="computedUserFullName"
                        :rules="[() => !!computedUserFullName || 'Please type your full name',() => computedUserFullName.length <= 70 || 'Full name cannot be longer than 70 character']"
                        :counter="70"
                        :value="computedUserFullName"
                        required
                      ></v-text-field>
                      <v-text-field
                        append-icon="phone"
                        name="phone_number"
                        label="Phone Number"
                        v-model="computedUserPhoneNumber"
                        :rules="[() => !!computedUserPhoneNumber || 'Phone number field can not leaved empty', () => computedUserPhoneNumber.length <= 15 || 'Phone Number cannot be longer than 15 character']"
                        :counter="15"
                        :value="computedUserPhoneNumber"
                      ></v-text-field>
                    </v-form>
                    <v-btn v-on:click="onUpdateProfile"  :disabled="!updateProfileFormValid" active-class
                           color="primary">
                      Update Profile
                    </v-btn>
                  </v-flex>
                </v-layout>

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
          <v-tab-item id="wireless-network">
            <v-card flat>
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">Manage Wireless Network</h3>
                </div>
              </v-card-title>
              <v-container>
                <v-btn color="teal" @click.native="openNewWifiConnectionCard" class="white--text mb-4">New WiFi Connection
                  <v-icon small right dark>network_wifi</v-icon>
                </v-btn>
                <!--Add  & Update user wifi connection dialog-->
                <v-dialog v-model="addNewWifiConnectionCard" max-width="500px">
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{wifiConnectionCardLine.headLine}} Wifi Connection</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container grid-list-md>
                        <v-form v-model="addNewWifiConnectionFormValid" ref="addNewWifiConnectionForm" lazy-validation>
                          <!--Connection name-->
                          <v-text-field
                            label="Connection Name"
                            :value="userWifiConnectionData.connectionName"
                            v-model="userWifiConnectionData.connectionName"
                            :rules="[() => !!userWifiConnectionData.connectionName || 'Connection name cannot leaved blank', () => userWifiConnectionData.connectionName.length <= 32 || 'Connection name can not be longer than 32 character']"
                            required
                            :counter="32"
                          ></v-text-field>
                          <!--SSID-->
                          <v-text-field
                            label="SSID"
                            :value="userWifiConnectionData.ssid"
                            v-model="userWifiConnectionData.ssid"
                            :rules="[() => !!userWifiConnectionData.ssid || 'SSID cannot leaved blank', () => userWifiConnectionData.ssid.length <= 32 || 'SSID can not be longer than 32 character']"
                            required
                            :counter="32"
                          ></v-text-field>
                          <!--Enable or disable wifi password -->
                          <v-layout wrap>
                            <v-flex xs12 sm6 md6>
                              <v-select
                                :items="securityEnabledSelectItem"
                                v-model="userWifiConnectionData.securityEnabled"
                                label="Wifi Security"
                                class="input-group--focused"
                                item-value="value"
                                required
                              ></v-select>
                            </v-flex>
                          </v-layout>
                          <!--If wifi password is enabled-->
                          <template v-if="userWifiConnectionData.securityEnabled == 1">
                                <v-text-field
                                  label="Wifi Password"
                                  :value="userWifiConnectionData.password"
                                  v-model="userWifiConnectionData.password"
                                  :rules="[() => !!userWifiConnectionData.password || 'Wifi Password cannot leaved blank', () => userWifiConnectionData.password.length <= 63 || 'Wifi Password can not be longer than 63 character']"
                                  :counter="63"
                                  required
                                ></v-text-field>
                          </template>
                        </v-form>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" flat @click.native="closeNewWifiConnectionCard">Cancel</v-btn>
                      <v-btn class="white--text" color="blue darken-1" :disabled="!addNewWifiConnectionFormValid" @click.native="wifiConnectionCardLine.submitFunction">{{wifiConnectionCardLine.submitButton}}</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <!--Datatable for connection list-->
                <v-data-table
                  :headers="userWifiConnectionTableHeader"
                  :items="userWifiConnectionList"
                  class="elevation-1"
                  :loading="userWIfiConnectionTableLoading"
                  item-key="connection_name"
                >
                  <template slot="items" slot-scope="props">
                    <td>{{ props.item.connection_name }}</td>
                    <td class="text-xs-left">{{ props.item.ssid }}</td>
                    <td v-if="props.item.security_enabled == '1'" class="text-xs-left">Enabled</td>
                    <td v-else>Disabled</td>
                    <td >
                      <v-btn icon class="mx-0" @click="editWifiConnection(props.item)">
                        <v-icon color="pink">edit</v-icon>
                      </v-btn>
                      <v-btn icon class="mx-0" @click="removeWifiConnection(props.item)">
                        <v-icon color="orange">delete</v-icon>
                      </v-btn>
                    </td>
                  </template>
                  <template slot="pageText" slot-scope="props">
                    Rows per page {{ props.pageStart }} - {{ props.pageStop }} of {{ props.itemsLength }}
                  </template>
                </v-data-table>
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
              <v-container grid-list-xl fluid>
                <v-form v-model="changePasswordFormValid" ref="changePasswordForm" lazy-validation>
                  <v-layout wrap>
                    <v-flex xs12 sm6>
                      <v-text-field
                        name="old_password"
                        label="Old Password"
                        v-model="oldPassword"
                        :append-icon="p1 ? 'visibility' : 'visibility_off'"
                        :append-icon-cb="() => (p1 = !p1)"
                        :type="p1 ? 'password' : 'text'"
                        :rules="[() => !!oldPassword || 'Please type your old password',() => oldPassword.length <= 50 || 'Password cannot be longer than 50 character', ()=> oldPassword.length >= 8 || 'Password must be atleast 8 character']"
                        counter
                        required
                      ></v-text-field>
                      <v-text-field
                        name="new_password"
                        label="New Password"
                        v-model="newPassword"
                        :append-icon="p2 ? 'visibility' : 'visibility_off'"
                        :append-icon-cb="() => (p2 = !p2)"
                        :type="p2 ? 'password' : 'text'"
                        :rules="[() => !!newPassword || 'Please enter your new password',() => newPassword.length <= 50 || 'Password cannot be longer than 50 character', ()=> newPassword.length >= 8 || 'Password must be atleast 8 character']"
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
                        :rules="[() => !!newPasswordRetype || 'Please retype your new password',() => newPassword == newPasswordRetype || 'Passwords does not match',() => newPasswordRetype.length <= 50 || 'Password cannot be longer than 50 character', ()=> newPasswordRetype.length >= 8 || 'Password must be atleast 8 character']"
                        counter
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <br>
                      Use at least 8 character and do not use a password from another site, or something that is too obvious
                      <br>
                    </v-flex>
                  </v-layout>
                  <v-btn v-on:click="onChangePassword" :disabled="!changePasswordFormValid" large active-class
                         color="primary">
                    Change Password
                  </v-btn>
                </v-form>
              </v-container>
            </v-card>
          </v-tab-item>
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
        </v-tabs>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
  import {CHANGE_PASSWORD_REQUEST} from '../store/actions/sidik'
  import {USER_PROFILE_UPDATE_REQUEST, USER_PROFILE_FULL_NAME_UPDATE, USER_PROFILE_PHONE_NUMBER_UPDATE} from '../store/actions/lemari'
  import {GET_USER_WIFI_CONNECTION_REQUEST, ADD_USER_WIFI_CONNECTION_REQUEST, UPDATE_USER_WIFI_CONNECTION_REQUEST, REMOVE_USER_WIFI_CONNECTION_REQUEST} from '../store/actions/gudang'

  export default {
    data () {
      return {
        changePasswordFormValid: false,
        updateProfileFormValid: false,
        addNewWifiConnectionFormValid: false,
        wifiConnectionCardLine: {
          'headLine': '',
          'submitButton': '',
          'submitFunction': this.onSubmitNewWifiConnection
        },
        oldPassword: '',
        newPassword: '',
        newPasswordRetype: '',
        addNewWifiConnectionCard: false,
        // Show or hide password
        p1: true,
        p2: true,
        p3: true,
        // Snackbar
        profileSnack: false,
        profileSnackMessage: '',
        profileSnackColor: '',
        profileSnackTimeOut: 6000,
        userWifiConnectionList: [],
        userWIfiConnectionTableLoading: true,
        securityEnabledSelectItem: [
          { text: 'Enabled', value: '1' },
          { text: 'Disabled', value: '0' }
        ],
        userWifiConnectionData: {
          userWifiConnectionUUID: '',
          connectionName: '',
          ssid: '',
          securityEnabled: '0',
          password: '-'
        },
        userWifiConnectionTableHeader: [
          {
            text: 'Name',
            align: 'left',
            value: 'connection_name'
          },
          { text: 'SSID',
            align: 'left',
            value: 'ssid'
          },
          { text: 'Wifi Password',
            align: 'left',
            value: 'security_enabled'
          },
          { text: 'Actions' }
        ]
      }
    },
    methods: {
      onSubmitNewWifiConnection: async function () {
        try {
          this.userWIfiConnectionTableLoading = true
          if (this.$refs.addNewWifiConnectionForm.validate()) {
            this.$store.dispatch(ADD_USER_WIFI_CONNECTION_REQUEST, this.userWifiConnectionData)
              .then((resp) => {
                this.generateSnack(resp.data.success.message, 'success')
                this.closeNewWifiConnectionCard()
                this.loadUserWifiConnectionList()
                this.userWIfiConnectionTableLoading = false
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
      removeWifiConnection: async function (item) {
        try {
          if (confirm('Remove Connection : ' + item.connection_name + ' ?')) {
            this.userWIfiConnectionTableLoading = true
            this.$store.dispatch(REMOVE_USER_WIFI_CONNECTION_REQUEST, item.user_wifi_connection_uuid)
              .then((resp) => {
                this.generateSnack(resp.data.success.message, 'success')
                this.loadUserWifiConnectionList()
                this.userWIfiConnectionTableLoading = false
              })
              .catch((err) => {
                this.generateSnack(err.response.data.error.message, 'error')
                this.userWIfiConnectionTableLoading = false
              })
          }
        } catch (error) {
          // Display client error
          console.error(error)
        }
      },
      updateWifiConnection: async function () {
        try {
          this.userWIfiConnectionTableLoading = true
          if (this.$refs.addNewWifiConnectionForm.validate()) {
            this.$store.dispatch(UPDATE_USER_WIFI_CONNECTION_REQUEST, this.userWifiConnectionData)
              .then((resp) => {
                console.log(resp.data.success.message)
                this.generateSnack(resp.data.success.message, 'success')
                this.closeNewWifiConnectionCard()
                this.loadUserWifiConnectionList()
                this.userWIfiConnectionTableLoading = false
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
      editWifiConnection: function (item) {
        // Change the data
        this.userWifiConnectionData.userWifiConnectionUUID = item.user_wifi_connection_uuid
        this.userWifiConnectionData.connectionName = item.connection_name
        this.userWifiConnectionData.ssid = item.ssid
        this.userWifiConnectionData.securityEnabled = item.security_enabled
        this.userWifiConnectionData.password = item.password
        // Change Card line mapping
        this.wifiConnectionCardLine.headLine = 'Update'
        this.wifiConnectionCardLine.submitButton = 'Update'
        this.wifiConnectionCardLine.submitFunction = this.updateWifiConnection
        this.addNewWifiConnectionCard = true
      },
      onChangePassword: async function () {
        try {
          if (this.$refs.changePasswordForm.validate()) {
            // When the form is valid
            const {oldPassword, newPassword, newPasswordRetype} = this
            this.$store.dispatch(CHANGE_PASSWORD_REQUEST, {oldPassword, newPassword, newPasswordRetype})
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
            const userPhoneNumber = this.computedUserPhoneNumber
            const userFullName = this.computedUserFullName
            this.$store.dispatch(USER_PROFILE_UPDATE_REQUEST, {userPhoneNumber, userFullName})
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
      loadUserWifiConnectionList: async function () {
        try {
          this.userWIfiConnectionTableLoading = true
          this.$store.dispatch(GET_USER_WIFI_CONNECTION_REQUEST)
            .then((resp) => {
              this.userWifiConnectionList = this.$store.getters.getUserWifiConnectionList
              this.userWIfiConnectionTableLoading = false
            })
        } catch (e) {
          // Display client error
          console.error(e)
        }
      },
      generateSnack: function (message, color) {
        this.profileSnackMessage = message
        this.profileSnackColor = color
        this.profileSnack = true
      },
      closeNewWifiConnectionCard: function () {
        this.addNewWifiConnectionCard = false
      },
      openNewWifiConnectionCard: function () {
        // Change Card line mapping
        this.wifiConnectionCardLine.headLine = 'Add'
        this.wifiConnectionCardLine.submitButton = 'Add'
        this.wifiConnectionCardLine.submitFunction = this.onSubmitNewWifiConnection
        this.addNewWifiConnectionCard = true
        // Reset Value
        this.userWifiConnectionData.connectionName = ''
        this.userWifiConnectionData.ssid = ''
        this.userWifiConnectionData.securityEnabled = '0'
        this.userWifiConnectionData.password = '-'
      }
    },
    computed: {
      computedUserFullName: {
        get: function () {
          return this.$store.getters.getProfile.full_name
        },
        set: function (newFullName) {
          this.$store.dispatch(USER_PROFILE_FULL_NAME_UPDATE, newFullName)
        }
      },
      computedUserPhoneNumber: {
        get: function () {
          return this.$store.getters.getProfile.phone_number
        },
        set: function (newPhoneNumber) {
          this.$store.dispatch(USER_PROFILE_PHONE_NUMBER_UPDATE, newPhoneNumber)
        }
      },
      computedUserEmail: function () {
        return this.$store.getters.getProfile.email
      },
      computedUserProfileImage: function () {
        return this.$store.getters.getProfile.profile_image
      }
    },
    beforeMount: function () {
      // Retrieve user wifi connection list
      this.loadUserWifiConnectionList()
    }
  }
</script>
