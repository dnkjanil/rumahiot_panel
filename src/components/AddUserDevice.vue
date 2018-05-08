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
              </v-container>
              <v-btn color="primary" @click.native="e1 = 2" :disabled="!selectedBoard" >Continue</v-btn>
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
            <v-stepper-content step="4">
              <v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>
              <v-btn color="primary" flat @click.native="e1 = 3"  >Previous</v-btn>
              <v-btn color="primary" @click.native="e1 = 1">Add device</v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-card>
    </v-flex>
  </v-layout>
</template>


<script>
  import {GET_SUPPORTED_BOARD_REQUEST, GET_SUPPORTED_SENSOR_REQUEST} from '../store/actions/gudang'
  import {AUTH_SIGNOUT} from '../store/actions/sidik'
  import {loaded} from 'vue2-google-maps'

  export default {
    data () {
      return {
        // Destination data items
        searchedAddress: '',
        searchedAddressObject: {},
        addDeviceMapCenter: {
          lat: 47.376332,
          lng: 8.547511
        },
        selectedDeviceLocation: '',
        // center: {lat: 47.376332, lng: 8.547511},
        // markers: [{
        //   position: [47.376332, 8.547511],
        //   text: 'Hauptgebäude der ETH Zürich'
        // }, {
        //   position: [47.374592, 8.548867],
        //   text: 'Hauptgebäude der Universität Zürich'
        // }],
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
      loadSupportedBoardList: async function () {
        try {
          this.$store.dispatch(GET_SUPPORTED_BOARD_REQUEST)
            .then((resp) => {
              this.supportedBoardList = resp.data.data.supported_boards
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
    },
    mounted () {
      this.loadAutoComplete()
    }
  }
</script>
