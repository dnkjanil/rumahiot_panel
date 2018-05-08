<template>
  <v-app id="inspire">
    <v-card flat="">
      <gmap-map
        :center="center"
        :zoom="15"
        style="width: 100%; height: 500px"
      >
      </gmap-map>
    </v-card>
  </v-app>
</template>
