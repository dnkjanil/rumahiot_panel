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
              <v-flex xs6>
                <v-select
                  :items="supportedBoardList"
                  v-model="supportedBoardList"
                  label="Select"
                  single-line
                  item-text="board_name"
                  item-value="abbr"
                  return-object
                  :hint="`${supportedBoardList.board_name}, ${supportedBoardList.chip}`"
                  persistent-hint
                ></v-select>
              </v-flex>
              <v-btn color="primary" @click.native="e1 = 2">Continue</v-btn>
              <v-btn flat>Cancel</v-btn>
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
          this.$store.dispatch(GET_SUPPORTED_SENSOR_REQUEST)
            .then((resp) => {
              console.log('added')
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
    },
    beforeMount () {
      this.loadSupportedBoardList()
      this.loadSupportedSensorList()
    }
  }
</script>
