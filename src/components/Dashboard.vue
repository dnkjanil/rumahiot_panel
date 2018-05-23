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
        <v-layout row>
          <!--Device Sensor Status-->
          <v-flex xs3>
            <v-card hover height="300">
              <v-card-title>
                <span class="title mb-0 primary--text">Device Sensor Status</span>
              </v-card-title>
              <pie-chart :chart-data="sensorStatusChartData"/>
            </v-card>
          </v-flex>
          <!--Device total data-->
          <v-flex xs9>
            <v-card hover height="300">
              <v-card-title>
                <span class="title mb-0 primary--text">Device Data Count</span>
              </v-card-title>
              <bar-chart :height="240" :chart-data="deviceDataCountChartData" :options="deviceDataCountChartData.options"/>
            </v-card>
          </v-flex>
        </v-layout>
        <!--User added chart-->
        <v-layout row wrap>
          <v-flex xs6>
            <v-card hover height="350">
              <v-card-title>
                <span class="title mb-0 primary--text">Tes line mantap</span>
              </v-card-title>
              <line-chart :height="290" v-if="datacollection" :chart-data="datacollection" :options=datacollection.options />
            </v-card>
          </v-flex>
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
        >
          <v-icon>add</v-icon>
        </v-btn>
        <span>Add new chart</span>
      </v-tooltip>
    </v-flex>
  </v-layout>
</template>

<script>
  import LineChart from '@/components/charts/LineChart'
  import DoughnutChart from '@/components/charts/DoughnutChart'
  import BarChart from '@/components/charts/BarChart'
  import PieChart from '@/components/charts/PieChart'
  import {GET_DEVICE_CHART_DATA_REQUEST, GET_SENSOR_STATUS_REQUEST} from '../store/actions/gudang'

  export default {
    components: {PieChart, BarChart, LineChart, DoughnutChart},
    data: () => ({
      datacollection: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Sensor One',
            data: [40, 20, 12, 100, 133, 33],
            fill: false,
            borderColor: '#f87979',
            backgroundColor: '#f87979'
          },
          {
            label: 'Sensor Two',
            data: [33, 121, 99, 10, 56, 27],
            fill: false,
            borderColor: '#819ff8',
            backgroundColor: '#819ff8'
          }
        ],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          title: {
            display: true,
            text: 'Yearly data for 2018'
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          tooltips: {
            mode: 'index',
            intersect: false
          },
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Month'
              }
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Sensor Value'
              }
            }]
          }
        }
      }
    }),
    methods: {
      loadDeviceChartData: async function () {
        try {
          this.$store.dispatch(GET_DEVICE_CHART_DATA_REQUEST)
        } catch (error) {
          // Display client error
          console.error(error)
        }
      },
      loadSensorStatusData: async function () {
        try {
          this.$store.dispatch(GET_SENSOR_STATUS_REQUEST)
        } catch (e) {
          // Display client error
          console.error(e)
        }
      },
      reloadDashboardData: function () {
        this.loadDeviceChartData()
        this.loadSensorStatusData()
      }
    },
    beforeMount: function () {
      this.loadDeviceChartData()
      this.loadSensorStatusData()
    },
    computed: {
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
            ]
          }
        }
      }
    }
  }
</script>
