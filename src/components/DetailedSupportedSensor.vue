<template>

</template>

<script>
  import {GET_DETAILED_SUPPORTED_SENSOR_REQUEST} from '../store/actions/gudang'

  export default {
    data () {
      return {
        detailedSupportedSensor: {}
      }
    },
    beforeMount: function () {
      // Run mounted code here
      this.getSupportedSensor()
    },
    methods: {
      getSupportedSensor: async function () {
        try {
          // Get the notification log
          this.$store.dispatch(GET_DETAILED_SUPPORTED_SENSOR_REQUEST)
            .then((resp) => {
              this.detailedSupportedSensor = this.$store.getters.getDetailedSupportedSensor
            })
        } catch (err) {
          console.error(err)
        }
      }
    }
  }
</script>
