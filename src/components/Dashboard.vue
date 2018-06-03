<template>
  <v-layout justify-space-around wrap>
    <v-flex xs12 sm9 mt-3>
      <v-card color="blue">
        <v-card-title>
          <v-tooltip left>
            <v-btn icon @click="reloadDashboardData" slot="activator">
              <v-icon color="white">
                refresh
              </v-icon>
            </v-btn>
            <span>Refresh dashboard data</span>
          </v-tooltip>
          <span class="headline mb-1 white--text">Dashboard</span><br>
        </v-card-title>
      </v-card>
      <v-container fluid grid-list-lg>
        <v-layout row wrap>
          <!--Device Sensor Status-->
          <v-flex v-if="!deviceStatusChartLoaded" md3 sm12 class="text-xs-center">
            <!--Loading card-->
            <v-card>
              <v-progress-circular :size="70" :width="7" indeterminate color="primary"></v-progress-circular>
            </v-card>
          </v-flex>
          <v-flex md3 xs12 v-if="deviceStatusChartLoaded">
            <v-card hover height="300">
              <v-card-title>
                <span class="title mb-0 primary--text">Device Sensor Status</span>
              </v-card-title>
              <pie-chart width="100%" height="240px" position="relative" :chart-data="sensorStatusChartData" :options="sensorStatusChartData.options"/>
            </v-card>
          </v-flex>
          <!--Device total data-->
          <v-flex v-if="!deviceChartLoaded" md9 sm12 class="text-xs-center">
            <!--Loading card-->
            <v-card>
              <v-progress-circular :size="70" :width="7" indeterminate color="primary"></v-progress-circular>
            </v-card>
          </v-flex>
          <v-flex md9 xs12 v-if="deviceChartLoaded">
            <v-card hover height="300">
              <v-card-title>
                <span class="title mb-0 primary--text">Device Data Count</span>
              </v-card-title>
              <bar-chart width="100%" height="240px" position="relative" :chart-data="deviceDataCountChartData" :options="deviceDataCountChartData.options"/>
            </v-card>
          </v-flex>
        </v-layout>
        <!--User added chart-->
          <v-layout row wrap align-center v-if="!userChartLoaded">
            <!--Loading card-->
            <v-flex class="text-xs-center">
              <v-card>
                <v-progress-circular :size="70" :width="7" indeterminate color="primary"></v-progress-circular>
              </v-card>
            </v-flex>
          </v-layout>
        <!--Todo : Make sure userDashboardChartData[deviceChart.user_dashboard_chart_uuid] available before calling it-->
        <v-layout row wrap v-if="userChartLoaded">
          <template v-for="(deviceChart) in userDeviceChart">
            <v-flex md6 xs12
                    :key="deviceChart.user_dashboard_chart_uuid"
            >
              <v-card hover height="380">
                <line-chart width="100%" height="330px" position="relative" :chart-data="userDashboardChartData[deviceChart.user_dashboard_chart_uuid]" :options=userDashboardChartData[deviceChart.user_dashboard_chart_uuid].options />
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-tooltip left>
                    <v-btn icon @click="onRemoveDeviceDashboardChart(deviceChart.user_dashboard_chart_uuid)" slot="activator">
                      <v-icon color="red">
                        delete
                      </v-icon>
                    </v-btn>
                    <span>Remove chart</span>
                  </v-tooltip>
                </v-card-actions>
              </v-card>
            </v-flex>
          </template>
        </v-layout>
      </v-container>
      <!--Add new device button-->
      <v-tooltip left>
        <!--Add new device button-->
        <v-btn
          fixed
          dark
          fab
          bottom
          right
          color="teal"
          slot="activator"
          @click="openAddDeviceChartDialog"
        >
          <v-icon>add</v-icon>
        </v-btn>
        <span>Add new chart</span>
      </v-tooltip>
      <!--Add new chart dialog-->
      <v-dialog v-model="addNewChartDialog" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Add new device chart</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-select
                :items="userSimpleDeviceList"
                v-model="selectedDevice"
                label="Choose your device"
                class="input-group--focused"
                item-text="device_name"
                item-value="device_uuid"
                prepend-icon="fa-microchip"
                :loading="simpleDeviceListLoading"
                autocomplete
                :rules="[() => !!selectedDevice || 'Please select your device']"
                required
              ></v-select>
              <v-layout wrap>
                <v-flex xs12 sm6 md6>
                  <v-select
                    :items="chartTypeList"
                    v-model="selectedChartType"
                    label="Choose chart range"
                    class="input-group--focused"
                    item-text="text"
                    item-value="value"
                    prepend-icon="fa-calendar-alt"
                    autocomplete
                    :rules="[() => !!selectedChartType || 'Please select the chart type']"
                    required
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <span><strong>This Month</strong> chart will give you current month statistic for selected device (Daily),
                    <strong>This Year</strong> chart will give you current year statistic for selected device (Monthly),
                  <strong>Custom range</strong> chart will give you statistic based on last N hour range, it can be set <strong>from 1 hour to 168 hour</strong></span>
                </v-flex>
              </v-layout>
              <v-layout wrap v-if="selectedChartType == '2'">
                <v-flex xs9>
                  <v-slider
                    :min="1"
                    :max="168"
                    v-model="customChartTimeRange"
                    label="Range(Hour)"
                    :rules="[() => !!customChartTimeRange || 'Please add hour range for the chart ',() => customChartTimeRange <= 168 || 'Hour range cannot be more than the last 168 hours', () => customChartTimeRange >= 1 || 'Hour range cannot be less than the last 1 hour']"
                  >
                  </v-slider>
                </v-flex>
                <v-flex xs3>
                  <v-text-field v-model="customChartTimeRange" type="number"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="closeAddDeviceChartDialog">Cancel</v-btn>
            <v-btn class="white--text" color="blue darken-1" :disabled="!addNewChartFormValid" @click.native="onAddNewDeviceDashboardChart">Add</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--Snack bar-->
      <v-snackbar
        :timeout="addDeviceChartSnackTimeout"
        :color="addDeviceChartSnackColor"
        v-model="addDeviceChartSnack"
        :multi-line="true"
      >
        {{ addDeviceChartSnackMessage }}
        <v-btn dark flat @click.native="addDeviceChartSnack = false">Close</v-btn>
      </v-snackbar>
    </v-flex>
  </v-layout>
</template>

<script>
  import LineChart from '@/components/charts/LineChart'
  import DoughnutChart from '@/components/charts/DoughnutChart'
  import BarChart from '@/components/charts/BarChart'
  import PieChart from '@/components/charts/PieChart'
  import {GET_DEVICE_CHART_DATA_REQUEST, GET_SENSOR_STATUS_REQUEST, GET_USER_SIMPLE_DEVICE_LIST_REQUEST, GET_DEVICE_MONTHLY_CHART_REQUEST, GET_DEVICE_YEARLY_CHART_REQUEST, GET_DEVICE_CUSTOM_CHART_REQUEST} from '../store/actions/gudang'
  import {GET_DEVICE_DASHBOARD_CHART_REQUEST, ADD_DEVICE_DASHBOARD_CHART_REQUEST, REMOVE_DEVICE_DASHBOARD_CHART_REQUEST} from '../store/actions/lemari'

  export default {
    components: {PieChart, BarChart, LineChart, DoughnutChart},
    data: () => ({
      // Add new device chart
      // Defaulting to 1 hour
      deviceChartLoaded: false,
      deviceStatusChartLoaded: false,
      customChartTimeRange: 1,
      selectedDevice: '',
      selectedChartType: '',
      chartTypeList: [
        { text: 'This Month', value: '0' },
        { text: 'This Year', value: '1' },
        { text: 'Custom Range', value: '2' }
      ],
      addNewChartDialog: false,
      simpleDeviceListLoading: true,
      // User chart
      userDeviceChart: '',
      userDashboardChartData: {},
      // Snackbar
      addDeviceChartSnackMessage: '',
      addDeviceChartSnackColor: '',
      addDeviceChartSnack: false,
      addDeviceChartSnackTimeout: 6000
    }),
    methods: {
      generateSnack: function (message, color) {
        this.addDeviceChartSnackMessage = message
        this.addDeviceChartSnackColor = color
        this.addDeviceChartSnack = true
      },
      onRemoveDeviceDashboardChart: async function (dashboardChartUUID) {
        if (confirm('Remove chart ?')) {
          try {
            this.$store.dispatch(REMOVE_DEVICE_DASHBOARD_CHART_REQUEST, dashboardChartUUID)
              .then((resp) => {
                this.generateSnack(resp.data.success.message, 'success')
                this.reloadDashboardData()
              })
              .catch((err) => {
                this.generateSnack(err.response.data.error.message, 'error')
              })
          } catch (error) {
            // Display client error
            console.error(error)
          }
        }
      },
      onAddNewDeviceDashboardChart: async function () {
        // Close the dialog
        this.addNewChartDialog = false
        try {
          let newDeviceDashboardData = {
            device_uuid: this.selectedDevice,
            statistic_type: this.selectedChartType,
            n_last_hour: this.customChartTimeRange
          }
          this.$store.dispatch(ADD_DEVICE_DASHBOARD_CHART_REQUEST, newDeviceDashboardData)
            .then((resp) => {
              this.generateSnack(resp.data.success.message, 'success')
              // Reload the user added chart
              this.loadDeviceDashboardChartData()
            })
            .catch((err) => {
              this.generateSnack(err.response.data.error.message, 'error')
            })
        } catch (error) {
          // Display client error
          console.error(error)
        }
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
      openAddDeviceChartDialog: function () {
        this.addNewChartDialog = true
        this.loadUserSimpleDeviceList()
      },
      closeAddDeviceChartDialog: function () {
        this.addNewChartDialog = false
      },
      loadDeviceChartData: async function () {
        try {
          this.deviceChartLoaded = false
          this.$store.dispatch(GET_DEVICE_CHART_DATA_REQUEST)
            .then((resp) => {
              this.deviceChartLoaded = true
            })
        } catch (error) {
          // Display client error
          console.error(error)
        }
      },
      loadDeviceDashboardChartData: async function () {
        try {
          this.$store.dispatch(GET_DEVICE_DASHBOARD_CHART_REQUEST)
            .then((resp) => {
              // Pre push it so it can be used for chart iterations
              this.userDeviceChart = resp.data.data.device_dashboard_charts
              // This thing need to be initiate first, somehow
              // Load the chart data
              for (let i = 0; i < this.$store.getters.getuserDeviceDashboardChart.device_dashboard_chart_count; i++) {
                if (this.$store.getters.getuserDeviceDashboardChart.device_dashboard_charts[i].statistic_type === '0') {
                  // Monthly
                  let currentDate = new Date()
                  let requestData = {
                    year: currentDate.getFullYear(),
                    month: currentDate.getMonth() + 1,
                    deviceUUID: this.$store.getters.getuserDeviceDashboardChart.device_dashboard_charts[i].device_uuid,
                    userDashboardChartUUID: this.$store.getters.getuserDeviceDashboardChart.device_dashboard_charts[i].user_dashboard_chart_uuid
                  }
                  // Execute the request
                  this.$store.dispatch(GET_DEVICE_MONTHLY_CHART_REQUEST, requestData)
                    .then(resp => {
                      // Use temp variable to pass the value
                      // Altering the object directly won't work
                      let tempData = JSON.parse(JSON.stringify(this.userDashboardChartData))
                      tempData[requestData.userDashboardChartUUID] = this.$store.getters.getUserDashboardChartData[requestData.userDashboardChartUUID]
                      this.userDashboardChartData = tempData
                    })
                } else if (this.$store.getters.getuserDeviceDashboardChart.device_dashboard_charts[i].statistic_type === '1') {
                  // Yearly
                  let currentDate = new Date()
                  let requestData = {
                    year: currentDate.getFullYear(),
                    deviceUUID: this.$store.getters.getuserDeviceDashboardChart.device_dashboard_charts[i].device_uuid,
                    userDashboardChartUUID: this.$store.getters.getuserDeviceDashboardChart.device_dashboard_charts[i].user_dashboard_chart_uuid
                  }
                  // Execute the request
                  this.$store.dispatch(GET_DEVICE_YEARLY_CHART_REQUEST, requestData)
                    .then(resp => {
                      // Use temp variable to pass the value
                      // Altering the object directly won't work
                      let tempData = JSON.parse(JSON.stringify(this.userDashboardChartData))
                      tempData[requestData.userDashboardChartUUID] = this.$store.getters.getUserDashboardChartData[requestData.userDashboardChartUUID]
                      this.userDashboardChartData = tempData
                    })
                } else if (this.$store.getters.getuserDeviceDashboardChart.device_dashboard_charts[i].statistic_type === '2') {
                  // Custom range
                  let currentDate = new Date()
                  let fromDate = new Date()
                  let requestData = {
                    divider: this.$store.getters.getuserDeviceDashboardChart.device_dashboard_charts[i].n_last_hour,
                    fromTime: currentDate.setHours(currentDate.getHours() - this.$store.getters.getuserDeviceDashboardChart.device_dashboard_charts[i].n_last_hour) / 1000,
                    toTime: fromDate.getTime() / 1000,
                    deviceUUID: this.$store.getters.getuserDeviceDashboardChart.device_dashboard_charts[i].device_uuid,
                    userDashboardChartUUID: this.$store.getters.getuserDeviceDashboardChart.device_dashboard_charts[i].user_dashboard_chart_uuid
                  }
                  // console.log(requestData.fromTime)
                  // console.log(requestData.toTime)
                  // Execute the request
                  this.$store.dispatch(GET_DEVICE_CUSTOM_CHART_REQUEST, requestData)
                    .then(resp => {
                      // Use temp variable to pass the value
                      // Altering the object directly won't work
                      let tempData = JSON.parse(JSON.stringify(this.userDashboardChartData))
                      tempData[requestData.userDashboardChartUUID] = this.$store.getters.getUserDashboardChartData[requestData.userDashboardChartUUID]
                      this.userDashboardChartData = tempData
                    })
                }
              }
            })
        } catch (error) {
          console.log(error)
        }
      },
      countObjectKey: function (object) {
        // Count object key count
        return Object.keys(object).length
      },
      loadSensorStatusData: async function () {
        try {
          this.deviceStatusChartLoaded = false
          this.$store.dispatch(GET_SENSOR_STATUS_REQUEST)
            .then((resp) => {
              this.deviceStatusChartLoaded = true
            })
        } catch (e) {
          // Display client error
          console.error(e)
        }
      },
      reloadDashboardData: async function () {
        this.loadDeviceChartData()
        this.loadSensorStatusData()
        // Refresh the user added chart
        this.deviceChartLoaded = false
        this.deviceStatusChartLoaded = false
        // Reload the user added chart
        this.userDashboardChartData = {}
        this.loadDeviceDashboardChartData()
      }
    },
    beforeMount: async function () {
      this.loadDeviceChartData()
      this.loadSensorStatusData()
      this.loadDeviceDashboardChartData()
    },
    computed: {
      userChartLoaded: function () {
        // To make sure all chart is loaded
        return this.$store.getters.getuserDeviceDashboardChart.device_dashboard_chart_count === this.countObjectKey(this.userDashboardChartData)
      },
      addNewChartFormValid: function () {
        return this.selectedChartType && this.selectedDevice && this.customChartTimeRange
      },
      userSimpleDeviceList: function () {
        return this.$store.getters.getSimpleDeviceList.user_devices
      },
      deviceDataCountChartData: function () {
        return {
          labels: this.$store.getters.getUserDeviceChartData.device_names,
          datasets: [
            {
              label: 'Data Count',
              backgroundColor: this.$store.getters.getUserDeviceChartData.background_colors,
              data: this.$store.getters.getUserDeviceChartData.data_counts
            }
          ],
          options: {
            legend: { display: false },
            scales:
                {
                  xAxes: [{
                    display: false
                  }]
                },
            responsive: true,
            maintainAspectRatio: false
          }
        }
      },
      sensorStatusChartData: function () {
        if (this.$store.getters.getSensorStatusData.status_count) {
          return {
            labels: ['Normal', 'Warning', 'Notification Disabled'],
            datasets: [
              {
                backgroundColor: ['#4CAF50', '#FF9800', '#2196f3'],
                // Normal, warning, and disabled respectively
                data: [this.$store.getters.getSensorStatusData.status_count.normal, this.$store.getters.getSensorStatusData.status_count.warning, this.$store.getters.getSensorStatusData.status_count.disabled]
              }
            ],
            options: {
              responsive: true,
              maintainAspectRatio: false
            }
          }
        }
      }
    }
  }
</script>
