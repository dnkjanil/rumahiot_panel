<template>
  <v-layout justify-space-around wrap>
    <v-flex xs12 sm9 mt-3>
      <v-card>
        <!--Device data tab-->
        <v-tabs icons-and-text centered dark color="blue">
          <v-tabs-slider color="yellow"></v-tabs-slider>
          <v-tab href="#export-new-device-data">
            Export New Data
            <v-icon>fa-file-excel</v-icon>
          </v-tab>
          <v-tab href="#exported-device-data">
            Exported Data
            <v-icon>fa-cloud-download-alt</v-icon>
          </v-tab>
          <v-tab-item id="exported-device-data">
            <v-card flat>
              <v-card-title primary-title>
                <v-tooltip left>
                  <v-btn icon @click="reloadExportedDeviceXlsxList" slot="activator">
                    <v-icon color="primary">
                      refresh
                    </v-icon>
                  </v-btn>
                  <span>Refresh device exported data list</span>
                </v-tooltip>
                <div>
                  <h3 class="headline mb-0">Exported Device Data</h3>
                </div>
              </v-card-title>
              <v-container>
                <v-data-table
                  :headers="deviceExportedXlsxTableHeader"
                  :items="exportedDeviceXlsxList"
                  class="elevation-1"
                  :loading="deviceExportedXlsxTableLoading"
                  item-key="device_uuid"
                >
                  <template slot="items" slot-scope="props">
                    <td>{{ props.item.device_name }}</td>
                    <td class="text-xs-left">{{ dateConverter(props.item.from_time) }}</td>
                    <td class="text-xs-left">{{ dateConverter(props.item.to_time) }}</td>
                    <td class="text-xs-left">{{ timeConverter(props.item.time_updated) }}</td>
                    <td>
                      <v-btn color="green" class="white--text" small :href=props.item.document_link v-if="props.item.document_ready">
                        Download Data
                        <v-icon small right dark>fa-download</v-icon>
                      </v-btn>
                      <v-btn v-else color="green" class="white--text" disabled small>
                        Generating
                        <v-icon small right dark>fa-spinner</v-icon>
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
          <v-tab-item id="export-new-device-data">
            <v-card flat>
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">Export New Device Data</h3>
                </div>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <v-flex xs12 md6>
                    <v-select
                      :items="userSimpleDeviceList"
                      v-model="selectedDevice"
                      label="Choose device"
                      class="input-group--focused"
                      item-text="device_name"
                      item-value="device_uuid"
                      :loading="simpleDeviceListLoading"
                      autocomplete
                      :rules="[() => !!selectedDevice || 'Please select a device']"
                      required
                    ></v-select>
                  </v-flex>
                  <v-layout row wrap>
                    <v-flex xs12 md4>
                      <span class="primary--text title mb-1">From Date</span>
                      <v-date-picker color="purple" v-model="selectedFromDate" ></v-date-picker>
                    </v-flex>
                    <v-flex xs12 md4>
                      <span class="primary--text title mb-1">To Date</span>
                      <v-date-picker color="pink" v-model="selectedToDate" ></v-date-picker>
                    </v-flex>
                  </v-layout>
                  <br>
                  <v-layout row wrap>
                    <v-flex xs12 md6>
                      <v-select
                        :items="timezoneList"
                        v-model="selectedTimezone"
                        label="Select timezone for your data"
                        class="input-group--focused"
                        item-text="device_name"
                        item-value="device_uuid"
                        :loading="timezoneListLoading"
                        autocomplete
                        :rules="[() => !!selectedTimezone || 'Please select a timezone']"
                        required
                      ></v-select>
                    </v-flex>
                    <v-flex xs12 md6>
                      <span>Choose the timezone to <strong>represent the data in exported document</strong> to make sure the data time match with your desired timezone.</span>
                    </v-flex>
                  </v-layout>
                </v-container>
                <v-btn color="primary" :disabled="!addNewExportedDeviceXlsxFormValid" @click="onAddNewExportedData" >Export Device Data</v-btn>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
        <!--Snack bar-->
        <v-snackbar
          :timeout="deviceDataSnackTimeOut"
          :color="deviceDataSnackColor"
          v-model="deviceDataSnack"
          :multi-line="true"
        >
          {{ deviceDataSnackMessage }}
          <v-btn dark flat @click.native="deviceDataSnack = false">Close</v-btn>
        </v-snackbar>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import {GET_DEVICE_EXPORTED_XLSX_REQUEST} from '../store/actions/lemari'
  import {GET_USER_SIMPLE_DEVICE_LIST_REQUEST, GET_TIMEZONES_REQUEST, ADD_NEW_DEVICE_EXPORTED_DATA_REQUEST} from '../store/actions/gudang'

  export default {
    data () {
      return {
        deviceExportedXlsxTableLoading: false,
        simpleDeviceListLoading: false,
        timezoneListLoading: false,
        selectedTimezone: '',
        selectedDevice: '',
        selectedFromDate: '',
        selectedToDate: '',
        deviceDataSnackMessage: '',
        deviceDataSnackTimeOut: 8000,
        deviceDataSnackColor: '',
        deviceDataSnack: false,
        deviceExportedXlsxTableHeader: [
          {
            text: 'Device Name',
            align: 'left',
            value: 'device_name'
          },
          { text: 'From Date',
            align: 'left',
            value: 'from_time'
          },
          { text: 'To Date',
            align: 'left',
            value: 'to_time'
          },
          { text: 'Time Generated',
            align: 'left',
            value: 'time_updated'
          },
          { text: 'Actions' }
        ]
      }
    },
    methods: {
      dateToUnixTimestamp: function (date) {
        return date.getTime() / 1000
      },
      loadTimezoneList: async function () {
        try {
          this.timezoneListLoading = true
          this.$store.dispatch(GET_TIMEZONES_REQUEST)
            .then(resp => {
              this.timezoneListLoading = false
            })
        } catch (error) {
          // Display client error
          console.error(error)
        }
      },
      onAddNewExportedData: async function () {
        try {
          if (this.addNewExportedDeviceXlsxFormValid) {
            // When the form is valid
            let requestData = {
              deviceUUID: this.selectedDevice,
              fromTime: this.dateToUnixTimestamp(new Date(this.selectedFromDate)),
              toTime: this.dateToUnixTimestamp(new Date(this.selectedToDate)),
              timezone: this.selectedTimezone
            }
            this.$store.dispatch(ADD_NEW_DEVICE_EXPORTED_DATA_REQUEST, requestData)
              .then((resp) => {
                this.generateSnack(resp.data.success.message, 'success')
                this.loadExportedDeviceXlsxList()
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
      generateSnack: function (message, color) {
        this.deviceDataSnackMessage = message
        this.deviceDataSnackColor = color
        this.deviceDataSnack = true
      },
      loadUserSimpleDeviceList: async function () {
        try {
          this.simpleDeviceListLoading = true
          this.$store.dispatch(GET_USER_SIMPLE_DEVICE_LIST_REQUEST)
            .then(resp => {
              this.simpleDeviceListLoading = false
            })
        } catch (error) {
          // Display client error
          console.error(error)
        }
      },
      dateConverter: function (unixTimeStamp) {
        // Convert unix time stamp into regular date
        const date = new Date(unixTimeStamp * 1000)
        return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear()
      },
      timeConverter: function (unixTimeStamp) {
        // Convert unix time stamp into regular date
        const date = new Date(unixTimeStamp * 1000)
        return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear() + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2)
      },
      reloadExportedDeviceXlsxList: function () {
        this.loadExportedDeviceXlsxList()
      },
      loadExportedDeviceXlsxList: async function () {
        this.deviceExportedXlsxTableLoading = true
        this.$store.dispatch(GET_DEVICE_EXPORTED_XLSX_REQUEST)
          .then((resp) => {
            this.deviceExportedXlsxTableLoading = false
          })
      }
    },
    beforeMount: function () {
      this.loadExportedDeviceXlsxList()
      this.loadUserSimpleDeviceList()
      this.loadTimezoneList()
    },
    computed: {
      addNewExportedDeviceXlsxFormValid: {
        get: function () {
          return this.selectedTimezone && this.selectedFromDate && this.selectedToDate && this.selectedDevice
        },
        set: function () {
          // Do nothing
        }
      },
      exportedDeviceXlsxList: {
        get: function () {
          return this.$store.getters.getDeviceExportedXlsxList.device_exported_xlsx
        },
        set: function () {
          // Do nothing
        }
      },
      userSimpleDeviceList: {
        get: function () {
          return this.$store.getters.getSimpleDeviceList.user_devices
        },
        set: function () {
          // Do nothing
        }
      },
      timezoneList: {
        get: function () {
          return this.$store.getters.getTimezoneList.all_timezones
        },
        set: function () {
          // Do nothing
        }
      }

    }
  }
</script>
