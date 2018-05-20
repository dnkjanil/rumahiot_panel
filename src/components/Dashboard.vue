<template>
  <v-layout justify-space-around wrap>
    <v-flex xs12 sm9 mt-3>
      <v-card color="blue">
        <v-card-title>
          <v-btn icon>
            <v-icon color="white">
              refresh
            </v-icon>
          </v-btn>
          <span class="headline mb-1 white--text">Dashboard</span><br>
        </v-card-title>
      </v-card>
      <v-container fluid grid-list-lg>
        <v-layout row>
          <!--Device Status-->
          <v-flex xs3>
            <v-card hover height="300">
              <v-card-title>
                <span class="title mb-0 primary--text">Device Sensor Status</span>
              </v-card-title>
              <pie-chart v-if="mydata2" :chart-data="mydata2"/>
            </v-card>
          </v-flex>
          <!--Device total data-->
          <v-flex xs9>
            <v-card hover height="300">
              <v-card-title>
                <span class="title mb-0 primary--text">Device Data Count</span>
              </v-card-title>
              <bar-chart :height="240" v-if="mydata3" :chart-data="mydata3" :options="mydata3.options"/>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
  import LineChart from '@/components/charts/LineChart'
  import DoughnutChart from '@/components/charts/DoughnutChart'
  import BarChart from '@/components/charts/BarChart'
  import PieChart from '@/components/charts/PieChart'

  export default {
    components: {PieChart, BarChart, LineChart, DoughnutChart},
    data: () => ({
      mydata2: {
        labels: ['Normal', 'Warning', 'Notification Disabled'],
        datasets: [
          {
            backgroundColor: ['#4CAF50', '#FF9800', '#2196f3'],
            data: [40, 20, 5]
          }
        ]
      },
      mydata3: {
        labels: ['Device 1 Namanya panjang sekali kawan', 'Device 2', 'Device 3', 'Device 4', 'Device 5', 'Device 6', 'Device 7', 'Device 8', 'Device 9'],
        datasets: [
          {
            label: 'Data Count',
            backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850', '#3e95cd', '#8e5ea2', '#3e95cd'],
            data: [-100, 5267, 2478, 5267, 2478, 5267, 2478, 5267, 123, 99]
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
    })
  }
</script>
