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
            <v-stepper-step editable step="1" :complete="e1 > 1">Choose Your Board</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step editable step="2" :complete="e1 > 2">Choose Your Sensor</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step editable step="3" :complete="e1 > 2">Pick Device Location</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step editable step="4">Add Network Connection</v-stepper-step>
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
              <v-btn color="primary" @click.native="e1 = 3">Continue</v-btn>
              <v-btn flat>Cancel</v-btn>
            </v-stepper-content>
            <v-stepper-content step="3">
              <v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>
              <v-btn color="primary" @click.native="e1 = 4">Continue</v-btn>
              <v-btn flat>Cancel</v-btn>
            </v-stepper-content>
            <v-stepper-content step="4">
              <v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>
              <v-btn color="primary" @click.native="e1 = 1">Continue</v-btn>
              <v-btn flat>Cancel</v-btn>
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

  export default {
    data () {
      return {
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
        select: { board_name: '', chip: '' },
        items: [
          { state: 'Florida', abbr: 'FL' },
          { state: 'Georgia', abbr: 'GA' },
          { state: 'Nebraska', abbr: 'NE' },
          { state: 'California', abbr: 'CA' },
          { state: 'New York', abbr: 'NY' }
        ]
      }
    },
    methods: {
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
      }
    },
    beforeMount () {
      this.loadSupportedBoardList()
      this.loadSupportedSensorList()
    }
  }
</script>
