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
          <v-list-tile exact v-for="item in items" :key="item.text" :to="{name:item.routeName}" >
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
          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon color="grey darken-1">fa-sliders-h</v-icon>
            </v-list-tile-action>
            <v-list-tile-title class="grey--text text--darken-1">Settings</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <!--Toolbar-->
      <v-toolbar color="white" fixed app>
        <v-toolbar-side-icon @click.stop="mainDrawer = !mainDrawer">
          <v-icon color="grey">menu</v-icon>
        </v-toolbar-side-icon>
        <img src="/static/img/logos/banner-toolbar.png" height="36px" alt="Rumah IoT">

        <v-spacer></v-spacer>

        <!--Notifications-->
        <v-menu
          offset-y
          full-width
          class = "hidden-sm-and-down"
          >
          <v-btn icon slot="activator">
            <v-badge color="red" left>
              <span slot="badge">6</span>
              <v-icon color="grey">notifications</v-icon>
            </v-badge>
          </v-btn>
          <v-card width="400">
            <v-card-media src="/static/img/other/arduino-1050655_640.jpg" height="50px">
            </v-card-media>
            <v-subheader class="grey--text text--darken-1">Notifications</v-subheader>
            <v-list two-line subheader dense>
              <v-list-tile v-for="item in notificationDummy" :key="item.message" @click="">
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.message }}</v-list-tile-title>
                  <v-list-tile-sub-title>{{ item.time }}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn icon ripple>
                    <v-icon color="yellow">fa-exclamation-triangle</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
            <v-card-actions>
              <v-btn block flat color="primary">View All</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>

        <!--User Menu-->
        <v-menu
          offset-y
          full-width
        >

          <v-btn icon slot="activator">
            <v-icon color="grey" >fa-user-circle</v-icon>
          </v-btn>
          <v-card width="200">
            <v-card-media :src="profileImage" height="200px">
            </v-card-media>
            <v-subheader class="grey--text text--darken-1">{{fullName}}<br/>{{email}}</v-subheader>
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
    </v-app>
</template>

<script>
  import {USER_PROFILE_REQUEST} from '../store/actions/lemari'
  import {AUTH_SIGNOUT} from '../store/actions/sidik'

  export default {
    data () {
      return {
        fullName: '',
        email: '',
        profileImage: '',
        mainDrawer: false,
        items: [
          { icon: 'fa-tachometer-alt', text: 'Dashboard', routeName: 'PanelRoot' },
          { icon: 'fa-microchip', text: 'My Device', routeName: 'PanelRoot' },
          { icon: 'fa-file-excel', text: 'Device Data', routeName: 'PanelRoot' },
          { icon: 'fa-address-card', text: 'My Profile', routeName: 'Profile' },
          { icon: 'fa-list-ul', text: 'Account Logs', routeName: 'PanelRoot' }
        ],
        pinnedDocs: [
          { icon: 'fa-book', text: 'Limitations' },
          { icon: 'fa-book', text: 'How do i added my own device' },
          { icon: 'fa-book', text: 'List of supported IoT device' },
          { icon: 'fa-book', text: 'List of supported sensor' }
        ],
        notificationDummy: [
          { message: '"KotaBunga-Stager" exceed threshold limit', time: '12/12/2018, 13:14 UTC' },
          { message: 'Device "KotaBunga-Stager" exceed threshold limit', time: '12/12/2018, 13:14 UTC' },
          { message: 'Device "KotaBunga-Stager" exceed threshold limit', time: '12/12/2018, 13:14 UTC' },
          { message: 'Device "KotaBunga-Stager" exceed threshold limit', time: '12/12/2018, 13:14 UTC' },
          { message: 'Device "KotaBunga-Stager" exceed threshold limit', time: '12/12/2018, 13:14 UTC' }
        ]
      }
    },
    mounted: async function () {
      try {
        this.$store.dispatch(USER_PROFILE_REQUEST)
          .then((resp) => {
            // Put profil data in the user menu
            this.fullName = resp.data.data.full_name
            this.email = resp.data.data.email
            this.profileImage = resp.data.data.profile_image
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
      }
    }
  }
</script>
