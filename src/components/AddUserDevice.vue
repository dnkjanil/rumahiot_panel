<template>
  <v-layout justify-space-around wrap>
    <v-flex xs12 sm9 mt-3>
      <v-card>
        <!--Breadcrumbs for navigation-->
        <v-breadcrumbs divider="/">
          <v-breadcrumbs-item
            exact
            :to="{name: 'UserDevices' }"
          >
            My Devices
          </v-breadcrumbs-item>
          <v-breadcrumbs-item
            exact
          >
            Add new device
          </v-breadcrumbs-item>
        </v-breadcrumbs>

        <v-stepper v-model="e1">
          <!--Stepper header-->
          <v-stepper-header>
            <v-stepper-step  step="1" :complete="e1 > 1">Choose Your Board</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step  step="2" :complete="e1 > 2">Choose Your Sensor</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step  step="3" :complete="e1 > 3">Pick Device Location</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step  step="4">Add Network Connection</v-stepper-step>
          </v-stepper-header>
          <v-stepper-items>
            <!--Choose board-->
            <v-stepper-content step="1">
              <v-container grid-list-xl fluid>
                <v-layout row wrap>
                  <v-flex xs12 sm6>
                    <v-select
                      :items="supportedBoardList"
                      v-model="selectedBoard"
                      label="Choose your board model"
                      class="input-group--focused"
                      item-text="board_name"
                      prepend-icon="fa-microchip"
                      :loading="supportedBoardListLoading"
                      autocomplete
                      required
                    ></v-select>
                  </v-flex>
                  <v-flex v-if="selectedBoard" xs12 sm6>
                    <v-card color="grey lighten-4" class="black--text">
                      <v-container fluid grid-list-lg>
                        <v-layout row>
                          <v-flex xs7>
                            <div>
                              <div class="headline">{{selectedBoard.board_name}}</div>
                              <div>
                                <h3 class="body-2 mb-0">
                                  <!--<v-icon color="primary" right>fa-microchip</v-icon>-->
                                  Controller : {{selectedBoard.chip}}
                                </h3>
                              </div>
                              <div>
                                <h3 class="body-2 mb-0">
                                  <!--<v-icon color="primary" right>fa-microchip</v-icon>-->
                                  Manufacturer : {{selectedBoard.manufacturer}}
                                  <a :href="selectedBoard.board_specification" target="_blank">Detailed Specifications</a>
                                  <br>
                                  <a :href="selectedBoard.board_image_source" target="_blank">Picture Source </a>
                                </h3>
                              </div>
                            </div>
                          </v-flex>
                          <v-flex xs5>
                            <v-card-media
                              :src="selectedBoard.board_image"
                              height="200px"
                              contain
                            ></v-card-media>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-card>
                  </v-flex>
                </v-layout>
                <!--Device name -->
                <v-flex xs12 sm6>
                  <v-text-field
                    name="device_name"
                    label="Device Name"
                    v-model="deviceName"
                    :rules="[() => !!deviceName || 'Please give your new device a name',() => deviceName.length <= 32 || 'Device name cannot be longer than 32 character']"
                    :counter="32"
                    required
                    prepend-icon="fa-font"
                  ></v-text-field>
                </v-flex>
              </v-container>
              <v-btn color="primary" @click.native="e1 = 2" :disabled="!selectedBoard || !deviceName" >Continue</v-btn>
            </v-stepper-content>
            <v-stepper-content step="2">
              <v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>
              <v-btn color="primary" flat @click.native="e1 = 1"  >Previous</v-btn>
              <v-btn color="primary" @click.native="e1 = 3">Continue</v-btn>
            </v-stepper-content>
            <!--Pick location-->
            <v-stepper-content step="3">
              <v-card flat>
                <!--Gmap Autocomplete-->
                <v-text-field
                  label="Pick Location"
                  class="input-group--focused"
                  v-model="searchedAddress"
                  id="searched_address"
                  required
                  append-icon="search"
                >
                </v-text-field>
                <!--Gmap component-->
                  <gmap-map
                    :center="addDeviceMapCenter"
                    :zoom="15"
                    style="width: 100%; height: 300px"
                  >
                    <!--Marker Location-->
                    <gmap-marker
                      v-if="selectedDeviceLocation"
                      :position="selectedDeviceLocation.position"
                      :clickable="true"
                      :draggable="true"
                      ref="addDeviceMarkerRef"
                      @click="updatePosition"
                      @dragend="updatePosition"
                    ></gmap-marker>
                  </gmap-map>

              </v-card>
              <v-btn color="primary" flat @click.native="e1 = 2"  >Previous</v-btn>
              <v-btn color="primary" @click.native="e1 = 4" :disabled="!selectedDeviceLocation || !searchedAddress">Continue</v-btn>
            </v-stepper-content>
            <!--Device connection-->
            <v-stepper-content step="4">
              <v-container grid-list-xl fluid>
                <!--New connection button-->
                <v-btn color="teal" @click.native="openNewWifiConnectionCard"class="white--text mb-4">New WiFi Connection
                </v-btn>
                <v-layout row wrap>
                  <v-flex xs12 sm6>
                    <v-select
                      :items="userWifiConnectionList"
                      v-model="selectedUserWifiConnection"
                      label="Choose your connection profile"
                      class="input-group--focused"
                      item-text="connection_name"
                      prepend-icon="network_wifi"
                      :loading="userWifiConnectionLoading"
                      autocomplete
                      required
                    ></v-select>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <span> <strong>Choose WiFi connection</strong> that is going to be <strong>used by your device</strong> to connect to RumahIoT, you can manage your device connection in <strong>My Profile</strong> menu, or you can always press <strong>New WiFi Connection</strong> button above <strong>to add a new wifi connection</strong> for your new device</span>
                  </v-flex>
                </v-layout>
                <!--Connection detail-->
                <v-flex v-if="selectedUserWifiConnection" xs12 sm6>
                  <v-card color="grey lighten-4">
                    <v-card-title primary-title>
                      <div>
                        <h3 class="subheading mb-0 primary--text">{{selectedUserWifiConnection.connection_name}}</h3>
                        <h3 class="body-2 mb-0">
                          <v-icon color="primary" right>network_wifi</v-icon>
                          SSID : {{selectedUserWifiConnection.ssid}}
                        </h3>
                        <h3 class="body-2 mb-0">
                          <v-icon color="primary" right>security</v-icon>
                          Wifi Security :
                          <template v-if="selectedUserWifiConnection.security_enabled == '1'">
                            Enabled
                          </template>
                          <template v-else>
                            Disabled
                          </template>
                        </h3>
                        <h3 v-if="selectedUserWifiConnection.security_enabled == '1'" class="body-2 mb-0">
                          <v-icon color="primary" right>lock</v-icon>
                          Wifi Password : {{selectedUserWifiConnection.password}}
                        </h3>
                      </div>
                    </v-card-title>
                  </v-card>
                </v-flex>
              </v-container>
              <!--Add  & Update user wifi connection dialog-->
              <v-dialog v-model="addNewWifiConnectionCard" max-width="500px">
                <v-card>
                  <v-card-title>
                    <span class="headline">Add Wifi Connection</span>
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
                            :rules="[() => !!userWifiConnectionData.password || 'Wifi Password cannot leaved blank', () => userWifiConnectionData.password.length <= 63 || 'Wifi Password can not be longer than 63 character',  ()=> userWifiConnectionData.password.length >= 8 || 'Password must be atleast 8 character']"
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
                    <v-btn class="white--text" color="blue darken-1" :disabled="!addNewWifiConnectionFormValid" @click.native="onSubmitNewWifiConnection">Add</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-btn color="primary" flat @click.native="e1 = 3"  >Previous</v-btn>
              <v-btn color="primary" @click.native="e1 = 1">Add device</v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
        <!--Snack bar-->
        <v-snackbar
          :timeout="addDeviceSnackTimeout"
          :color="addDeviceSnackColor"
          v-model="addDeviceSnack"
          :multi-line="true"
        >
          {{ addDeviceSnackMessage }}
          <v-btn dark flat @click.native="profileSnack = false">Close</v-btn>
        </v-snackbar>
      </v-card>
    </v-flex>
  </v-layout>
</template>


<script>
  import {GET_SUPPORTED_BOARD_REQUEST, GET_SUPPORTED_SENSOR_REQUEST, GET_USER_WIFI_CONNECTION_REQUEST, ADD_USER_WIFI_CONNECTION_REQUEST} from '../store/actions/gudang'
  import {loaded} from 'vue2-google-maps'

  export default {
    data () {
      return {
        // Add device snack
        addDeviceSnack: false,
        addDeviceSnackMessage: '',
        addDeviceSnackColor: '',
        addDeviceSnackTimeout: 6000,
        // Add wifi connection
        securityEnabledSelectItem: [
          { text: 'Enabled', value: '1' },
          { text: 'Disabled', value: '0' }
        ],
        addNewWifiConnectionCard: false,
        addNewWifiConnectionFormValid: false,
        userWifiConnectionData: {
          userWifiConnectionUUID: '',
          connectionName: '',
          ssid: '',
          securityEnabled: '0',
          password: 'yourwifipassword'
        },
        // Wifi connection
        userWifiConnectionLoading: false,
        userWifiConnectionList: [],
        selectedUserWifiConnection: '',
        // Destination data items
        searchedAddress: '',
        searchedAddressObject: {},
        addDeviceMapCenter: {
          lat: 47.376332,
          lng: 8.547511
        },
        selectedDeviceLocation: '',
        deviceName: '',
        e1: 0,
        breadcrumbItems: [
          {
            text: 'My Devices',
            disabled: false
          },
          {
            text: 'Add new device',
            disabled: true
          }
        ],
        // User selected board
        selectedBoard: '',
        supportedBoardListLoading: false,
        supportedBoardList: [],
        supportedBoardCount: 0,
        supportedSensorList: [],
        supportedSensorCount: 0,
        select: {board_name: '', chip: ''},
        items: [
          {state: 'Florida', abbr: 'FL'},
          {state: 'Georgia', abbr: 'GA'},
          {state: 'Nebraska', abbr: 'NE'},
          {state: 'California', abbr: 'CA'},
          {state: 'New York', abbr: 'NY'}
        ]
      }
    },
    methods: {
      openNewWifiConnectionCard: function () {
        this.addNewWifiConnectionCard = true
      },
      closeNewWifiConnectionCard: function () {
        this.addNewWifiConnectionCard = false
      },
      onSubmitNewWifiConnection: async function () {
        try {
          if (this.$refs.addNewWifiConnectionForm.validate()) {
            this.$store.dispatch(ADD_USER_WIFI_CONNECTION_REQUEST, this.userWifiConnectionData)
              .then((resp) => {
                this.generateSnack(resp.data.success.message, 'success')
                this.closeNewWifiConnectionCard()
                this.loadUserWifiConnectionList()
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
      updatePosition () {
        this.selectedDeviceLocation.position.lat = this.$refs.addDeviceMarkerRef.$markerObject.position.lat()
        this.selectedDeviceLocation.position.lng = this.$refs.addDeviceMarkerRef.$markerObject.position.lng()
      },
      setPlace (place) {
        this.latLng = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
      },
      loadUserWifiConnectionList: async function () {
        try {
          this.userWifiConnectionLoading = true
          this.$store.dispatch(GET_USER_WIFI_CONNECTION_REQUEST)
            .then((resp) => {
              this.userWifiConnectionList = this.$store.getters.getUserWifiConnectionList
              this.userWifiConnectionLoading = false
            })
        } catch (e) {
          // Display client error
          console.error(e)
        }
      },
      generateSnack: function (message, color) {
        this.addDeviceSnackMessage = message
        this.addDeviceSnackColor = color
        this.addDeviceSnack = true
      },
      loadSupportedBoardList: async function () {
        try {
          this.$store.dispatch(GET_SUPPORTED_BOARD_REQUEST)
            .then((resp) => {
              this.supportedBoardList = resp.data.data.supported_boards
            })
        } catch (error) {
          // Display client error
          console.error(error)
        }
      },
      loadSupportedSensorList: async function () {
        try {
          // Loading bar
          this.supportedBoardListLoading = true
          this.$store.dispatch(GET_SUPPORTED_SENSOR_REQUEST)
            .then((resp) => {
              // Loading bar
              this.supportedBoardListLoading = false
            })
        } catch (error) {
          // Display client error
          console.error(error)
        }
      },
      loadAutoComplete () {
        /* eslint-disable */
        let methodScope = this
        loaded.then(() => {
          let self = this
          let searchedAddressInput = document.getElementById('searched_address')
          let searchedAddressAutoComplete = new google.maps.places.Autocomplete(searchedAddressInput)
          searchedAddressAutoComplete.addListener('place_changed', function () {
            let place = searchedAddressAutoComplete.getPlace()
            self.searchedAddressObject = {
              place
            }
            const address = []
            // Iterate through address_components
            for (let i = 0; i < place.address_components.length; i++) {
              address.push(place.address_components[i] && place.address_components[i].short_name || '')
            }
            address.join(' ')
            // Change searchedAddress Model so it will shows address selected
            self.searchedAddress = address
            // Update location marker
            self.selectedDeviceLocation = {
              position : {
                lat: place.geometry.location.lat(),
                lng : place.geometry.location.lng()
              }
            }
            self.addDeviceMapCenter.lat = place.geometry.location.lat()
            self.addDeviceMapCenter.lng = place.geometry.location.lng()
          })
        })
      }
    },
    beforeMount () {
      this.loadSupportedBoardList()
      this.loadSupportedSensorList()
      this.loadUserWifiConnectionList()
    },
    mounted () {
      this.loadAutoComplete()
    }
  }
</script>
