<template>
  <v-app id="inspire">

    <!--Main drawer-->
    <v-navigation-drawer
      v-model="mainDrawer"
      persistent
      enable-resize-watcher
      fixed
      app
      temporary
    >
      <v-toolbar flat dense class="transparent">
        <img class="mx-auto" src="/static/img/logos/banner-toolbar.png" height="36px" alt="Rumah IoT">
      </v-toolbar>
      <v-list dense>
        <v-subheader class="mt-3 grey--text text--darken-1">MENU</v-subheader>
      </v-list>
      <v-list dense>
        <v-list-tile v-for="item in items" :key="item.text" :to="{name:item.routeName}">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ item.text }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-subheader class="mt-3 grey--text text--darken-1">PINNED DOCUMENTATIONS</v-subheader>
        <v-list>
          <v-list-tile v-for="item in pinnedDocs" :key="item.text" @click="">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-list-tile class="mt-3" @click="">
          <v-list-tile-action>
            <v-icon color="grey darken-1">add_circle_outline</v-icon>
          </v-list-tile-action>
          <v-list-tile-title class="grey--text text--darken-1">Browse Documentations</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <!--Toolbar-->
    <v-toolbar dense color="white" fixed app>
      <v-toolbar-side-icon @click.stop="mainDrawer = !mainDrawer">
        <v-icon color="grey">menu</v-icon>
      </v-toolbar-side-icon>
      <img src="/static/img/logos/banner-toolbar.png" height="36px" alt="Rumah IoT">

      <v-spacer></v-spacer>

      <!--Notifications-->
      <v-menu
        offset-y
        full-width
        class="hidden-sm-and-down"
        attach
        nudge-left=360
      >
        <v-btn icon slot="activator">
          <v-badge color="red" right>
            <span slot="badge">{{deviceNotificationLog.device_notification_logs_count}}</span>
            <v-icon color="grey">notifications</v-icon>
          </v-badge>
        </v-btn>
        <v-card width="400">
          <v-card-media src="/static/img/other/arduino-1050655_640.jpg" height="50px">
          </v-card-media>
          <v-subheader class="grey--text text--darken-1">Notifications</v-subheader>
          <v-container
            style="max-height: 250px"
            class="scroll-y">
          <v-list two-line subheader dense>
            <v-list-tile v-for="log in deviceNotificationLog.device_notification_logs" :key="log.device_sensor_notification_log_uuid" @click="">
              <v-list-tile-content>
                <v-list-tile-title>Device : {{ log.device_name }}</v-list-tile-title>
                <v-list-tile-sub-title> Sensor : {{ log.user_sensor_name }}</v-list-tile-sub-title>
                <v-list-tile-sub-title>Latest Value : {{log.latest_value}}{{log.unit_symbol}} @ {{ timeConverter(log.time_reached) }}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <template v-if="log.notification_type == '0'">
                  <v-btn icon ripple>
                    <v-icon color="orange">fa-exclamation-triangle</v-icon>
                  </v-btn>
                </template>
                <template v-else>
                  <v-btn icon ripple>
                    <v-icon color="green">check_circle</v-icon>
                  </v-btn>
                </template>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
          </v-container>
          <v-card-actions>
            <v-btn block color="primary" @click="getDeviceNotificationLog">Check Notification</v-btn>
            <v-btn block flat color="red" @click="clearAllDeviceNotificationLog">Clear All </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu
        offset-y>

      <!--User Menu-->
      <v-menu
        offset-y
        full-width
        attach
        nudge-left=170
      >

        <v-btn icon slot="activator">
          <v-icon color="grey">fa-user-circle</v-icon>
        </v-btn>
        <v-card width="200">
          <v-card-media :src="computedUserProfileImage" height="200px">
          </v-card-media>
          <v-subheader class="primary--text text--darken-1 mt-0">{{computedUserFullName}}</v-subheader>
          <v-subheader class="grey--text text--darken-1 mt-0">{{computedUserEmail}}</v-subheader>
          <v-list dense>
            <v-list-tile :to="{name:'Profile'}">
              <v-list-tile-action>
                <v-icon>fa-address-card</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  My Profile
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile @click="onSignOut">
              <v-list-tile-action>
                <v-icon>fa-sign-out-alt</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  Sign Out
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-menu>
    </v-toolbar>
    <v-slide-x-transition>
      <router-view></router-view>
    </v-slide-x-transition>
    <!--Snackbar-->
    <v-snackbar
      :timeout="deviceListSnackTimeOut"
      :color="deviceNotificationLogListSnackColor"
      v-model="deviceNotificationLogListSnack"
      :multi-line="true"
    >
      {{ deviceNotificationLogListSnackMessage }}
      <v-btn dark flat @click.native="deviceNotificationLogListSnack = false">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
  import {USER_PROFILE_REQUEST} from '../store/actions/lemari'
  import {AUTH_SIGNOUT} from '../store/actions/sidik'
  import {
    DEVICE_NOTIFICATION_LOG_LIST_REQUEST,
    CLEAR_ALL_DEVICE_NOTIFICATION_REQUEST
  } from '../store/actions/surat'

  export default {
    data () {
      return {
        mainDrawer: false,
        items: [
          {icon: 'fa-tachometer-alt', text: 'Dashboard', routeName: 'Dashboard'},
          {icon: 'fa-microchip', text: 'My Devices', routeName: 'UserDevices'},
          {icon: 'fa-file-excel', text: 'Device Data', routeName: 'DeviceData'},
          {icon: 'fa-address-card', text: 'My Profile', routeName: 'Profile'}
        ],
        pinnedDocs: [
          {icon: 'fa-book', text: 'Limitations'},
          {icon: 'fa-book', text: 'How do i added my own device'},
          {icon: 'fa-book', text: 'List of supported IoT device'},
          {icon: 'fa-book', text: 'List of supported sensor'}
        ],
        deviceNotificationLog: {},
        // Notification log snack
        deviceNotificationLogListSnackMessage: '',
        deviceNotificationLogListSnackColor: '',
        deviceNotificationLogListSnack: false,
        deviceListSnackTimeOut: 6000
      }
    },
    beforeMount: function () {
      // Retrieve profile data
      this.getUserProfile()
      // Retrieve device notification log
      this.getDeviceNotificationLog()
    },
    computed: {
      computedUserFullName: {
        get: function () {
          return this.$store.getters.getProfile.full_name
        },
        set: function () {
          // Do nothing
        }
      },
      computedUserEmail: {
        get: function () {
          return this.$store.getters.getProfile.email
        },
        set: function () {
          // Do nothing
        }
      },
      computedUserProfileImage: {
        get: function () {
          return this.$store.getters.getProfile.profile_image
        },
        set: function () {
          // Do nothing
        }
      }
    },
    methods: {
      onSignOut: async function () {
        try {
          // Execute the signout action
          this.$store.dispatch(AUTH_SIGNOUT)
            .then(() => {
              this.$router.push('/signin')
            })
        } catch (error) {
          // Display client error
          console.error(error)
        }
      },
      timeConverter: function (unixTimeStamp) {
        // Convert unix time stamp into regular datetime
        const date = new Date(unixTimeStamp * 1000)
        return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear() + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2)
      },
      clearAllDeviceNotificationLog: async function () {
        try {
          // Clear all the notification log
          this.$store.dispatch(CLEAR_ALL_DEVICE_NOTIFICATION_REQUEST)
            .then((resp) => {
              // Push success notification
              this.generateSnack(resp.data.success.message, 'success')
            })
            .catch((err) => {
              console.log(err)
              this.generateSnack(err.response.data.error.message, 'error')
            })
        } catch (err) {
          console.error(err)
        }
      },
      generateSnack: function (message, color) {
        this.deviceNotificationLogListSnackMessage = message
        this.deviceNotificationLogListSnackColor = color
        this.deviceNotificationLogListSnack = true
      },
      getDeviceNotificationLog: async function () {
        try {
          // Get the notification log
          this.$store.dispatch(DEVICE_NOTIFICATION_LOG_LIST_REQUEST)
            .then((resp) => {
              this.deviceNotificationLog = this.$store.getters.getDeviceNotificationList
            })
        } catch (err) {
          console.error(err)
        }
      },
      getUserProfile: async function () {
        try {
          this.$store.dispatch(USER_PROFILE_REQUEST)
        } catch (error) {
          // Display client error
          console.error(error)
        }
      }
    }
  }
</script>
