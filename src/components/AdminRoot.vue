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
        <v-subheader class="mt-3 grey--text text--darken-1">ADMIN MENU</v-subheader>
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
      </v-list>
    </v-navigation-drawer>
    <!--Toolbar-->
    <v-toolbar dense color="white" fixed app>
      <v-toolbar-side-icon @click.stop="mainDrawer = !mainDrawer">
        <v-icon color="grey">menu</v-icon>
      </v-toolbar-side-icon>
      <img src="/static/img/logos/banner-toolbar.png" height="36px" alt="Rumah IoT">

      <v-spacer></v-spacer>

      <!--Account Menu-->
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
          <v-list dense>
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
  </v-app>
</template>

<script>
  import {AUTH_SIGNOUT} from '../store/actions/sidik'

  export default {
    data () {
      return {
        mainDrawer: false,
        items: [
          {icon: 'fa-microchip', text: 'Supported Board', routeName: 'DetailedSupportedBoard'},
          {icon: 'fa-assistive-listening-systems', text: 'Supported Sensor', routeName: 'DetailedSupportedSensor'}
        ]
      }
    },
    methods: {
      onSignOut: async function () {
        try {
          // Execute the signout action
          this.$store.dispatch(AUTH_SIGNOUT)
            .then(() => {
              this.$router.push('/admin/signin')
            })
        } catch (error) {
          // Display client error
          console.error(error)
        }
      },
      generateSnack: function (message, color) {
        this.deviceNotificationLogListSnackMessage = message
        this.deviceNotificationLogListSnackColor = color
        this.deviceNotificationLogListSnack = true
      }
    }
  }
</script>
