<template>
  <v-layout justify-space-around wrap>
    <v-flex xs12 sm9 mt-3 >
      <v-card>
          <!--Device list tab-->
          <v-tabs icons-and-text centered dark color="blue">
            <v-tabs-slider color="yellow"></v-tabs-slider>
            <v-tab href="#device-list">
              Device List
              <v-icon>fa-list-ul</v-icon>
            </v-tab>
            <v-tab href="#by-location">
              By Location
              <v-icon>fa-thumbtack</v-icon>
            </v-tab>
            <!--Device List Tab-->
            <v-tab-item id="device-list">
              <v-card flat>

              </v-card>
            </v-tab-item>
            <!-- Device by location tab -->
            <v-tab-item id="by-location">
              <v-card flat>
                <gmap-map
                  :center="center"
                  :zoom="7"
                  style="style= width: 100%; height: 450px"
                  ref="deviceMap"
                >
                  <!--Gmap Tool-Tip-->
                  <gmap-info-window :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen" @closeclick="infoWinOpen=false">
                    <v-tabs
                      centered
                      v-model="active"
                      color="blue"
                      dark
                      height="50"
                      slider-color="yellow"
                    >
                      <v-tab ripple href="#sensor-info">
                        <v-icon>fa-tachometer-alt </v-icon>
                      </v-tab>
                      <v-tab ripple href="#location-info">
                        <v-icon>fa-compass</v-icon>
                      </v-tab>
                      <!--Sensor Info-->
                      <v-tab-item id="sensor-info">
                        <v-card
                          width="400"
                          flat
                        >
                          <v-card-title primary-title>

                            <div>
                              <span class="headline mb-1">{{deviceName}}</span><br>
                              <a class="title">Overview</a>
                            </div>

                          </v-card-title>

                          <v-container
                            style="max-height: 200px"
                            class="scroll-y">
                            <v-list two-line>
                              <template v-for="sensor in deviceSensors">
                                <v-list-tile avatar ripple :key="index" @click="">
                                  <v-list-tile-content>
                                    <v-list-tile-title>{{sensor.user_sensor_name}}</v-list-tile-title>
                                    <v-list-tile-sub-title class="text--primary">Latest Sensor Value : {{sensor.latest_value}}{{sensor.unit_symbol}}</v-list-tile-sub-title>
                                    <v-list-tile-sub-title>Sensor Threshold : {{sensor.sensor_threshold}}{{sensor.unit_symbol}}</v-list-tile-sub-title>
                                  </v-list-tile-content>

                                  <v-list-tile-action v-if="sensor.latest_value > sensor.sensor_threshold">
                                    <v-list-tile-action-text>Warning</v-list-tile-action-text>
                                    <v-icon color="yellow">warning</v-icon>
                                  </v-list-tile-action>
                                  <v-list-tile-action v-else>
                                    <v-list-tile-action-text>All good</v-list-tile-action-text>
                                    <v-icon color="green">done</v-icon>
                                  </v-list-tile-action>
                                    <!--<template v-if="sensor.latest_value < sensor.sensor_threshold">-->
                                      <!---->
                                        <!--<v-list-tile-action-text>All Good</v-list-tile-action-text>-->
                                        <!--<v-icon color="green">fa-check-circle</v-icon>-->
                                    <!--</template>-->
                                </v-list-tile>
                                <v-divider></v-divider>
                              </template>
                            </v-list>
                          </v-container>
                          <v-btn flat depressed small color="primary">Configure This Device</v-btn>
                        </v-card>
                      </v-tab-item>
                      <!--Location info-->
                      <v-tab-item id="location-info">
                        <v-card
                          width="400"
                          flat
                        >
                          <v-card-title primary-title>
                            <div>
                              <span class="headline mb-1">{{deviceName}}</span><br>
                              <a class="title mb-1">Location Detail</a><br/><br/>
                            </div>
                            <div>
                              <span class="subheading">{{deviceLocationtext}}</span><br/><br/>
                              <span>Lattitude : {{infoWindowPos.lat}}</span><br/>
                              <span>Longitude : {{infoWindowPos.lng}}</span>
                            </div>

                          </v-card-title>
                          <v-btn flat depressed small color="primary">Configure This Device</v-btn>
                        </v-card>
                      </v-tab-item>
                    </v-tabs>
                  </gmap-info-window>
                  <gmap-marker
                    :key="i"
                    v-for="(m,i) in markers"
                    :position="m.position"
                    :clickable="true"
                    @click="toggleInfoWindow(m,i)"
                  ></gmap-marker>
                </gmap-map>
              </v-card>
            </v-tab-item>
          </v-tabs>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  /* eslint-disable no-undef */

  import { USER_DEVICE_LIST_REQUEST } from '../store/actions/gudang'
  import {AUTH_SIGNOUT} from '../store/actions/sidik'

  export default {
    data () {
      return {
        center: {
          lat: -6.948877,
          lng: 110.38932850000003
        },
        deviceName: '',
        deviceLocationtext: '',
        deviceSensors: [],
        infoWindowPos: {
          lat: 0,
          lng: 0
        },
        infoWinOpen: false,
        currentMidx: null,
        //  optional: offset infowindow so it visually sits nicely on top of our marker
        infoOptions: {
          pixelOffset: {
            width: 0,
            height: -35
          }
        },
        markers: []
      }
    },
    methods: {
      // When the marker is clicked
      toggleInfoWindow: function (marker, idx) {
        this.infoWindowPos = marker.position
        this.deviceName = marker.device_name
        this.deviceLocationtext = marker.location_text
        this.deviceSensors = marker.device_sensors
        //  check if its the same marker that was selected if yes toggle
        if (this.currentMidx === idx) {
          this.infoWinOpen = !this.infoWinOpen
        } else {
          this.infoWinOpen = true
          this.currentMidx = idx
        }
      }
    },
    // Load all user device for the map
    mounted: async function () {
      try {
        const searchParameter = {
          // Default value
          'page': '',
          'limit': '',
          'query': ''
        }
        this.$store.dispatch(USER_DEVICE_LIST_REQUEST, searchParameter)
          .then((resp) => {
            // Put the marker from the result
            this.markers = this.$store.getters.getDeviceList.results
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
