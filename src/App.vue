<template>
  <v-app>
    <v-content>
      <v-fade-transition>
        <router-view></router-view>
      </v-fade-transition>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {}
    },
    name: 'App'
  }
</script>
