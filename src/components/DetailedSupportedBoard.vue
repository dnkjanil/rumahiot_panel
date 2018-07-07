<template>

</template>

<script>
  import {GET_DETAILED_SUPPORTED_BOARD_REQUEST} from '../store/actions/gudang'

  export default {
    data () {
      return {
        detailedSupportedBoard: {}
      }
    },
    beforeMount: function () {
      // Run mounted code here
      this.getSupportedBoard()
    },
    methods: {
      getSupportedBoard: async function () {
        try {
          // Get the notification log
          this.$store.dispatch(GET_DETAILED_SUPPORTED_BOARD_REQUEST)
            .then((resp) => {
              this.detailedSupportedBoard = this.$store.getters.getDetailedSupportedBoard
            })
        } catch (err) {
          console.error(err)
        }
      }
    }
  }
</script>
