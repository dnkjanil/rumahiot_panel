<template>
  <v-layout justify-space-around wrap>
    <v-flex xs12 sm9 mt-3>
      <v-card>
        <v-card-title>
          <v-tooltip left>
            <v-btn icon @click="getSupportedSensor" slot="activator">
              <v-icon color="primary">
                refresh
              </v-icon>
            </v-btn>
            <span>Refresh sensor data</span>
          </v-tooltip>
          <span class="headline mb-1">Supported Sensors</span><br>
          <v-spacer></v-spacer>
          <v-text-field
            append-icon="search"
            label="Search"
            single-line
            hide-details
            v-model="supportedSensorSearch"
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="tableHeaders"
          :items="detailedSupportedSensor.detailed_supported_sensors"
          :search="supportedSensorSearch"
          item-key="master_sensor_reference_uuid"
          :loading="supportedSensorLoading"
        >
          <!--Loading process-->
          <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
          <template slot="items" slot-scope="props">
            <td>{{ props.item.sensor_model }}</td>
            <td class="text-xs-left">{{ props.item.master_sensor_reference_uuid }}</td>
            <td >
              <v-btn icon class="mx-0" @click="onUpdateSensor(props.item)">
                <v-icon color="blue">edit</v-icon>
              </v-btn>
              <v-btn icon class="mx-0" @click="removeSensorConfirmation(props.item.sensor_model, props.item.master_sensor_reference_uuid)">
                <v-icon color="red">delete</v-icon>
              </v-btn>
            </td>
          </template>
          <template slot="pageText" slot-scope="props">
            Rows per page {{ props.pageStart }} - {{ props.pageStop }} of {{ props.itemsLength }}
          </template>
        </v-data-table>
      </v-card>
      <!--Add new board card-->
      <v-dialog v-model="newSupportedSensorCard" max-width="1200px" persistent>
        <v-card>
          <v-card-title>
            <span class="headline">Add New Supported Sensor</span>
          </v-card-title>
          <v-container grid-list-xl fluid>
            <v-layout wrap>
              <v-flex xs12 sm6>
                <span class="subheading primary--text">JSON Reference For new supported sensor</span>
                <v-textarea
                  :loading="newSupportedSensorLoading"
                  box
                  label="New supported sensor data in JSON format"
                  auto-grow
                  v-model="newSupportedSensor"
                  clearable
                  append-icon="fa-file-code"
                ></v-textarea>
              </v-flex>
              <v-flex xs12 sm6>
                <span class="subheading primary--text">Syntax Highlighted JSON</span>
                <!-- Code Block -->
                <highlight-code lang="json">
                  {{newSupportedSensor}}
                </highlight-code>
              </v-flex>
            </v-layout>
            <v-btn color="primary" :disabled="!newSupportedSensor" @click.native="addSupportedSensor">Add new sensor</v-btn>
            <v-btn color="primary" dark flat @click.native="newSupportedSensorCard = false">Close</v-btn>
          </v-container>
        </v-card>
      </v-dialog>
      <!--Update sensor card-->
      <v-dialog v-model="updateSupportedSensorCard" max-width="1200px" persistent>
        <v-card>
          <v-card-title>
            <span class="headline">Update Supported Sensor</span>
          </v-card-title>
          <v-container grid-list-xl fluid>
            <v-layout wrap>
              <v-flex xs12 sm6>
                <span class="subheading primary--text">JSON Reference For updated sensor</span>
                <v-textarea
                  :loading="updateSupportedSensorLoading"
                  box
                  label="Update supported sensor data in JSON format"
                  auto-grow
                  v-model="updatedSensor"
                  clearable
                  append-icon="fa-file-code"
                ></v-textarea>
              </v-flex>
              <v-flex xs12 sm6>
                <span class="subheading primary--text">Syntax Highlighted JSON</span>
                <!-- Code Block -->
                <highlight-code lang="json">
                  {{updatedSensor}}
                </highlight-code>
              </v-flex>
            </v-layout>
            <v-btn color="primary" :disabled="!updatedSensor" @click.native="updateSupportedSensor">Update Sensor</v-btn>
            <v-btn color="primary" dark flat @click.native="updateSupportedSensorCard = false">Close</v-btn>
          </v-container>
        </v-card>
      </v-dialog>
      <!--Remove sensor confirmation dialog-->
      <v-dialog v-model="removeSensorConfirmationDialog" max-width="400px">
        <v-card>
          <v-card-title>
            <span class="headline">Remove Confirmation</span>
          </v-card-title>
          <v-card-text>
            <span>Remove board : <strong>{{removedSensor.model}}</strong> </span>
          </v-card-text>
          <v-card-actions>
            <v-btn flat large active-class color="red" @click="removeSensorConfirmationDialog = false">Cancel</v-btn>
            <v-btn @click="removeSupportedSensor(removedSensor.uuid)" large active-class class="white--text" color="red">Remove Sensor</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--Add new board button-->
      <v-tooltip left>
        <!--Add new board button-->
        <v-btn
          fixed
          dark
          fab
          bottom
          right
          color="teal"
          slot="activator"
          @click.native="newSupportedSensorCard = true"
        >
          <v-icon>add</v-icon>
        </v-btn>
        <span>Add new sensor</span>
      </v-tooltip>
      <!--Snack bar-->
      <v-snackbar
        :timeout="snackTimeOut"
        :color="snackColor"
        v-model="snackModel"
        :multi-line="true"
      >
        {{ snackMessage }}
        <v-btn dark flat @click.native="snackModel = false">Close</v-btn>
      </v-snackbar>
    </v-flex>
  </v-layout>
</template>

<script>
  import {GET_DETAILED_SUPPORTED_SENSOR_REQUEST, ADD_DETAILED_SUPPORTED_SENSOR_REQUEST, REMOVE_DETAILED_SUPPORTED_SENSOR_REQUEST, UPDATE_DETAILED_SUPPORTED_SENSOR_REQUEST} from '../store/actions/gudang'

  export default {
    data () {
      return {
        removeSensorConfirmationDialog: false,
        newSupportedSensorLoading: false,
        snackTimeOut: 6000,
        snackColor: '',
        removedSensor: {
          model: '',
          uuid: ''
        },
        updatedSensor: '',
        snackModel: '',
        snackMessage: '',
        detailedSupportedSensor: {},
        newSupportedSensor: '',
        supportedSensorSearch: '',
        newSupportedSensorCard: false,
        updateSupportedSensorCard: false,
        updateSupportedSensorLoading: false,
        supportedSensorLoading: true,
        tableHeaders: [
          {
            text: 'Sensor Model',
            align: 'left',
            value: 'sensor_model'
          },
          {
            text: 'UUID',
            value: 'master_sensor_reference_uuid',
            align: 'left'
          },
          {
            text: 'Actions'
          }
        ]
      }
    },
    beforeMount: function () {
      // Run mounted code here
      this.getSupportedSensor()
    },
    methods: {
      removeSensorConfirmation: function (sensorModel, sensorUUID) {
        this.removeSensorConfirmationDialog = true
        this.removedSensor.model = sensorModel
        this.removedSensor.uuid = sensorUUID
      },
      onUpdateSensor: function (sensorData) {
        const sensorDataCopy = JSON.parse(JSON.stringify(sensorData))
        // Remove unnecessary key
        // delete sensorDataCopy.gampang_template_uuid
        // delete sensorDataCopy.time_added
        this.updatedSensor = JSON.stringify(sensorDataCopy, null, '\t')
        this.updateSupportedSensorCard = true
      },
      removeSupportedSensor: async function (sensorUUID) {
        try {
          // this.supportedBoardLoading = true
          this.$store.dispatch(REMOVE_DETAILED_SUPPORTED_SENSOR_REQUEST, this.removedSensor.uuid)
            .then(resp => {
              this.removeSensorConfirmationDialog = false
              this.generateSnack(resp.data.success.message, 'success')
              this.supportedSensorLoading = false
              this.getSupportedSensor()
            })
            .catch(err => {
              this.supportedSensorLoading = false
              this.removeSensorConfirmationDialog = false
              this.generateSnack(err.response.data.error.message, 'error')
            })
        } catch (err) {
          console.error(err)
        }
      },
      updateSupportedSensor: async function () {
        try {
          // this.supportedBoardLoading = true
          this.$store.dispatch(UPDATE_DETAILED_SUPPORTED_SENSOR_REQUEST, this.updatedSensor)
            .then(resp => {
              this.updateSupportedSensorCard = false
              this.generateSnack(resp.data.success.message, 'success')
              this.updateSupportedSensorLoading = false
              this.getSupportedSensor()
            })
            .catch(err => {
              this.updateSupportedSensorLoading = false
              this.updateSupportedSensorCard = false
              this.generateSnack(err.response.data.error.message, 'error')
            })
        } catch (err) {
          console.error(err)
        }
      },
      generateSnack: function (message, color) {
        this.snackMessage = message
        this.snackColor = color
        this.snackModel = true
      },
      getSupportedSensor: async function () {
        try {
          // Get the notification log
          this.supportedSensorLoading = true
          this.$store.dispatch(GET_DETAILED_SUPPORTED_SENSOR_REQUEST)
            .then((resp) => {
              this.detailedSupportedSensor = this.$store.getters.getDetailedSupportedSensor
              this.supportedSensorLoading = false
            })
        } catch (err) {
          console.error(err)
        }
      },
      addSupportedSensor: async function () {
        try {
          this.newSupportedSensorLoading = true
          this.$store.dispatch(ADD_DETAILED_SUPPORTED_SENSOR_REQUEST, this.newSupportedSensor)
            .then(resp => {
              this.newSupportedSensorCard = false
              this.newSupportedSensor = ''
              this.generateSnack(resp.data.success.message, 'success')
              this.newSupportedSensorLoading = false
              this.getSupportedSensor()
            })
            .catch(err => {
              this.newSupportedSensorLoading = false
              this.generateSnack(err.response.data.error.message, 'error')
            })
        } catch (err) {
          console.error(err)
        }
      }
    }
  }
</script>
