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
            <v-stepper-step  step="1" :complete="e1 > 1">Choose Your Board</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step  step="2" :complete="e1 > 2">Add Your Sensor</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step  step="3" :complete="e1 > 3">Pick Device Location</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step  step="4">Add Network Connection</v-stepper-step>
          </v-stepper-header>
          <v-stepper-items>
            <!--Choose board-->
            <v-stepper-content step="1">
              <v-container grid-list-xl fluid>
                <v-layout row wrap>
                  <v-flex xs12 sm6>
                    <v-select
                      :items="supportedBoardList"
                      v-model="selectedBoard"
                      label="Choose your board model"
                      class="input-group--focused"
                      item-text="board_name"
                      prepend-icon="fa-microchip"
                      :loading="supportedBoardListLoading"
                      autocomplete
                      required
                      :rules="[() => !!selectedBoard || 'Please choose your board model']"
                    ></v-select>
                  </v-flex>
                  <v-flex v-if="selectedBoard" xs12 sm6>
                    <v-card color="grey lighten-4" class="black--text">
                      <v-container fluid grid-list-lg>
                        <v-layout row>
                          <v-flex xs7>
                            <div>
                              <div class="headline">{{selectedBoard.board_name}}</div>
                              <div>
                                <h3 class="body-2 mb-0">
                                  <!--<v-icon color="primary" right>fa-microchip</v-icon>-->
                                  Controller : {{selectedBoard.chip}}
                                </h3>
                              </div>
                              <div>
                                <h3 class="body-2 mb-0">
                                  <!--<v-icon color="primary" right>fa-microchip</v-icon>-->
                                  Manufacturer : {{selectedBoard.manufacturer}}
                                  <a :href="selectedBoard.board_specification" target="_blank">Detailed Specifications</a>
                                  <br>
                                  <a :href="selectedBoard.board_image_source" target="_blank">Picture Source </a>
                                </h3>
                              </div>
                            </div>
                          </v-flex>
                          <v-flex xs5>
                            <v-card-media
                              :src="selectedBoard.board_image"
                              height="200px"
                              contain
                            ></v-card-media>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-card>
                  </v-flex>
                </v-layout>
                <!--Device name -->
                <v-flex xs12 sm6>
                  <v-text-field
                    name="device_name"
                    label="Device Name"
                    v-model="deviceName"
                    :rules="[() => !!deviceName || 'Please give your new device a name',() => deviceName.length <= 32 || 'Device name cannot be longer than 32 character']"
                    :counter="32"
                    required
                    prepend-icon="fa-font"
                  ></v-text-field>
                </v-flex>
                <v-layout row wrap>
                  <v-flex xs12 sm6>
                    <v-card-text>
                      <v-layout row wrap>
                        <v-flex xs9>
                          <v-slider
                            :min="5"
                            :max="1440"
                            v-model="dataSendingInterval"
                            label="Interval"
                            :rules="[() => !!dataSendingInterval || 'Please give your device data sending interval',() => dataSendingInterval <= 1440 || 'Data sending interval cannot be more than 1440 Minute', () => dataSendingInterval >= 5 || 'Data sending interval cannot be less than 5 Minute']"
                          >
                          </v-slider>
                        </v-flex>
                        <v-flex xs3>
                          <v-text-field v-model="dataSendingInterval" type="number"></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-flex>
                    <v-flex xs12 sm6>
                      <span> You can <strong>configure how often</strong> your device will send its data (In minutes), data sending interval can be configured <strong>between 5 minutes to 1440 minutes.</strong>i.e. if you pick 5 minute then your device will send its data every 5 minutes.</span>
                    </v-flex>
                </v-layout>
              </v-container>
              <v-btn color="primary" @click.native="e1 = 2" :disabled="!selectedBoard || !deviceName" >Continue</v-btn>
            </v-stepper-content>
            <!--Pick device sensor-->
            <v-stepper-content step="2">
              <v-card flat>
                <v-card-title primary-title>
                  <div>
                    <h3 class="title mb-0">{{deviceName}}</h3>
                    <h5 class="subheading mb-0 primary--text">Sensor Configuration</h5>
                    <br>
                  </div>
                </v-card-title>
                <v-btn color="teal" @click.native="openAddSensorCard"class="white--text mb-4">Add Sensor
                  <v-icon small right dark> </v-icon>
                </v-btn>
                <v-container fluid grid-list-md>
                  <v-layout row wrap>
                    <v-flex
                      v-for="(sensor, index) in addedSensor"
                      :key="sensor.random_uuid"
                      xs3
                    >
                      <v-card color="grey lighten-4" class="black--text" hover>
                        <v-container fluid grid-list-lg>
                          <v-layout row>
                            <v-flex>
                              <div>
                                <div class="title mb-0 primary--text">{{sensor.added_sensor_name}}</div>
                                <div>
                                  <h3 class="body-2 mb-0">
                                    <!--<v-icon color="primary" right>fa-microchip</v-icon>-->
                                    Model : {{sensor.master_sensor_reference_data.sensor_model}}
                                  </h3>
                                </div>
                              </div>
                            </v-flex>
                            <v-flex>
                              <v-card-media
                                :src="sensor.master_sensor_reference_data.sensor_image_url"
                                height="65px"
                                contain
                              ></v-card-media>
                            </v-flex>
                          </v-layout>
                        </v-container>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <!--Threshold direction symbol-->
                          <v-btn icon class="mx-0" @click="onUpdateSensorData(index)">
                            <v-icon color="blue">edit</v-icon>
                          </v-btn>
                          <v-btn icon class="mx-0" @click="removeAddedSensor(index)">
                            <v-icon color="red">delete</v-icon>
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-flex>
                  </v-layout>
                  <v-spacer></v-spacer>
                </v-container>
              </v-card>
              <!--Add new sensor dialog-->
              <v-dialog v-model="addSensorCard" max-width="700px" persistent>
                  <v-card>
                    <v-card-title>
                      <span class="headline">Add Sensor To Your Board</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container grid-list-md>
                        <v-layout row wrap>
                          <v-flex xs12 sm6>
                            <v-select
                              :items="supportedSensorList"
                              v-model="selectedSensor"
                              label="Choose your sensor"
                              class="input-group--focused"
                              item-text="sensor_model"
                              prepend-icon="fa-assistive-listening-systems"
                              :loading="supportedSensorListLoading"
                              autocomplete
                              :rules="[() => !!selectedSensor || 'Please select your sensor model']"
                              required
                            ></v-select>
                          </v-flex>
                          <v-flex v-if="selectedSensor" xs12 sm6>
                            <v-card color="grey lighten-4" class="black--text">
                              <v-container fluid grid-list-lg>
                                <v-layout row>
                                  <v-flex xs7>
                                    <div>
                                      <div class="headline">{{selectedSensor.sensor_model}}</div>
                                      <div>
                                        <h3 class="body-3 mb-0">
                                          Measures :
                                        </h3>
                                        <h3 v-for="value_type in selectedSensor.sensor_value_type" class="body-1 mb-0">
                                          <strong>{{value_type.value_type}}</strong> , Unit : {{value_type.unit}}({{value_type.unit_symbol}})
                                          <v-divider></v-divider>
                                        </h3>
                                      </div>
                                      <div>
                                        <h3 class="body-2 mb-0">
                                          <a :href="selectedSensor.sensor_image_source" target="_blank">Picture Source </a>
                                        </h3>
                                      </div>
                                    </div>
                                  </v-flex>
                                  <v-flex xs5>
                                    <v-card-media
                                      :src="selectedSensor.sensor_image_url"
                                      height="100px"
                                      contain
                                    ></v-card-media>
                                  </v-flex>
                                </v-layout>
                              </v-container>
                            </v-card>
                          </v-flex>
                        </v-layout>
                        <!--Sensor name -->
                        <v-layout row wrap>
                          <v-flex xs12 sm6>
                            <v-text-field
                              label="Sensor Name"
                              v-model="addedSensorName"
                              :rules="[() => !!addedSensorName || 'Please give your sensor a name',() => addedSensorName.length <= 32 || 'Sensor name cannot be longer than 32 character']"
                              :counter="32"
                              required
                              prepend-icon="fa-font"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6>
                            <span> You can set <strong>notification threshold</strong> so you get notified when specific sensor value goes over threshold later in <strong>My Devices</strong> page, <strong>all notifications are disabled by default.</strong></span>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-card-text>
                    <v-divider></v-divider>
                    <template v-if="selectedBoardPinOption">
                      <!--Sensor configuration-->
                      <v-card-title>
                        <span class="headline">Sensor Configuration</span>
                      </v-card-title>
                      <!--Iterate through sensor pin mapping-->
                      <v-card-text>
                        <v-container grid-list-md>
                          <template v-for="(pin, index) in selectedBoardPinOption.pin_mapping">
                            <h3 class="body-2 mb-0">
                              Sensor Pin {{pin.sensor_pin}} : {{pin.sensor_pin_name}}
                            </h3>
                            <v-flex xs6 sm6>
                              <v-select
                                :items="pin.mapping_options"
                                label="Board Pin"
                                max-height="400"
                                persistent-hint
                                item-text="device_pin_name"
                                required
                                v-model="selectedSensorOptions[index]"
                                :rules="[() => !!selectedSensorOptions[index] || 'Please select board pin']"
                              ></v-select>
                            </v-flex>
                          </template>
                        </v-container>
                      </v-card-text>
                    </template>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" flat @click.native="closeAddSensorCard">Cancel</v-btn>
                      <v-btn class="white--text" color="blue darken-1" :disabled="!addSensorFormValid" @click.native="appendAddedSensor">Add</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              <!--Update sensor dialog-->
              <v-dialog v-model="updateSensorCard" v-if="updateSensorDataTemp" max-width="700px" persistent>
                <v-card>
                  <v-card-title>
                    <span class="headline">Update Sensor {{addedSensor[updatedSensorIndex].added_sensor_name}} </span>
                  </v-card-title>
                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout row wrap>
                        <v-flex xs12 sm6>
                          <v-select
                            :items="supportedSensorList"
                            v-model="updateSensorDataTemp.master_sensor_reference_data"
                            label="Choose your sensor"
                            class="input-group--focused"
                            item-text="sensor_model"
                            item-value="sensor_model"
                            prepend-icon="fa-assistive-listening-systems"
                            return-object
                            :loading="supportedSensorListLoading"
                            autocomplete
                            :rules="[() => !!updateSensorDataTemp.master_sensor_reference_data || 'Please select your sensor model']"
                            required
                          ></v-select>
                        </v-flex>
                        <v-flex v-if="selectedSensor" xs12 sm6>
                          <v-card color="grey lighten-4" class="black--text">
                            <v-container fluid grid-list-lg>
                              <v-layout row>
                                <v-flex xs7>
                                  <div>
                                    <div class="headline">{{selectedSensor.sensor_model}}</div>
                                    <div>
                                      <h3 class="body-3 mb-0">
                                        Measures :
                                      </h3>
                                      <h3 v-for="value_type in selectedSensor.sensor_value_type" class="body-1 mb-0">
                                        <strong>{{value_type.value_type}}</strong> , Unit : {{value_type.unit}}({{value_type.unit_symbol}})
                                        <v-divider></v-divider>
                                      </h3>
                                    </div>
                                    <div>
                                      <h3 class="body-2 mb-0">
                                        <a :href="selectedSensor.sensor_image_source" target="_blank">Picture Source </a>
                                      </h3>
                                    </div>
                                  </div>
                                </v-flex>
                                <v-flex xs5>
                                  <v-card-media
                                    :src="selectedSensor.sensor_image_url"
                                    height="100px"
                                    contain
                                  ></v-card-media>
                                </v-flex>
                              </v-layout>
                            </v-container>
                          </v-card>
                        </v-flex>
                      </v-layout>
                      <!--Sensor name -->
                      <v-layout row wrap>
                        <v-flex xs12 sm6>
                          <v-text-field
                            label="Sensor Name"
                            v-model="updateSensorDataTemp.added_sensor_name"
                            :rules="[() => !!updateSensorDataTemp.added_sensor_name || 'Please give your sensor a name',() => updateSensorDataTemp.added_sensor_name.length <= 32 || 'Sensor name cannot be longer than 32 character']"
                            :counter="32"
                            required
                            prepend-icon="fa-font"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6>
                          <span> You can set <strong>notification threshold</strong> so you get notified when specific sensor value goes over threshold later in <strong>My Devices</strong> page, <strong>all notifications are disabled by default.</strong></span>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                  <v-divider></v-divider>
                  <template v-if="selectedBoardPinOption">
                    <!--Sensor configuration-->
                    <v-card-title>
                      <span class="headline">Sensor Configuration</span>
                    </v-card-title>
                    <!--Iterate through sensor pin mapping-->
                    <v-card-text v-if="">
                      <v-container grid-list-md>
                        <template v-for="(pin, index) in updateSensorDataTemp.sensor_pin_mappings">
                          <h3 class="body-2 mb-0">
                            Sensor Pin {{pin.sensor_pin}} : {{pin.sensor_pin_name}}
                          </h3>
                          <v-flex xs6 sm6>
                            <v-select
                              :items="selectedBoardPinOption.pin_mapping[index].mapping_options"
                              label="Board Pin"
                              max-height="400"
                              persistent-hint
                              item-text="device_pin_name"
                              item-value="device_pin_name"
                              return-object
                              required
                              v-model="updateSensorDataTemp.sensor_pin_mappings[index]"
                              :rules="[() => !!updateSensorDataTemp.sensor_pin_mappings[index] || 'Please select board pin']"
                            ></v-select>
                          </v-flex>
                        </template>
                      </v-container>
                    </v-card-text>
                  </template>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click.native="closeUpdateSensorCard">Cancel</v-btn>
                    <v-btn class="white--text" color="blue darken-1" :disabled="!updateSensorFormValid" @click.native="updateSensorData">Update</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
                <br/>
                <v-btn color="primary" flat @click.native="e1 = 1"  >Previous</v-btn>
                <v-btn color="primary" @click.native="e1 = 3" :disabled="addedSensor.length == 0">Continue</v-btn>
            </v-stepper-content>
            <!--Pick location-->
            <v-stepper-content step="3">
              <v-card flat>
                <!--Gmap Autocomplete-->
                <v-text-field
                  label="Pick Location"
                  class="input-group--focused"
                  v-model="searchedAddress"
                  id="searched_address"
                  required
                  append-icon="search"
                >
                </v-text-field>
                <!--Gmap component-->
                  <gmap-map
                    :center="addDeviceMapCenter"
                    :zoom="15"
                    style="width: 100%; height: 300px"
                  >
                    <!--Marker Location-->
                    <gmap-marker
                      v-if="selectedDeviceLocation"
                      :position="selectedDeviceLocation.position"
                      :clickable="true"
                      :draggable="true"
                      ref="addDeviceMarkerRef"
                      @click="updatePosition"
                      @dragend="updatePosition"
                    ></gmap-marker>
                  </gmap-map>

              </v-card>
              <br>
              <v-btn color="primary" flat @click.native="e1 = 2"  >Previous</v-btn>
              <v-btn color="primary" @click.native="e1 = 4" :disabled="!selectedDeviceLocation || !searchedAddress">Continue</v-btn>
            </v-stepper-content>
            <!--Device connection-->
            <v-stepper-content step="4">
              <v-container grid-list-xl fluid>
                <!--New connection button-->
                <v-btn color="teal" @click.native="openNewWifiConnectionCard"class="white--text mb-4">New WiFi Connection
                </v-btn>
                <v-layout row wrap>
                  <v-flex xs12 sm6>
                    <v-select
                      :items="userWifiConnectionList"
                      v-model="selectedUserWifiConnection"
                      label="Choose your connection profile"
                      class="input-group--focused"
                      item-text="connection_name"
                      prepend-icon="network_wifi"
                      :loading="userWifiConnectionLoading"
                      autocomplete
                      required
                    ></v-select>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <span> <strong>Choose WiFi connection</strong> that is going to be <strong>used by your device</strong> to connect to RumahIoT, you can manage your device connection in <strong>My Profile</strong> menu, or you can always press <strong>New WiFi Connection</strong> button above <strong>to add a new wifi connection</strong> for your new device</span>
                  </v-flex>
                </v-layout>
                <!--Connection detail-->
                <v-flex v-if="selectedUserWifiConnection" xs12 sm6>
                  <v-card color="grey lighten-4">
                    <v-card-title primary-title>
                      <div>
                        <h3 class="subheading mb-0 primary--text">{{selectedUserWifiConnection.connection_name}}</h3>
                        <h3 class="body-2 mb-0">
                          <v-icon color="primary" right>network_wifi</v-icon>
                          SSID : {{selectedUserWifiConnection.ssid}}
                        </h3>
                        <h3 class="body-2 mb-0">
                          <v-icon color="primary" right>security</v-icon>
                          Wifi Security :
                          <template v-if="selectedUserWifiConnection.security_enabled == '1'">
                            Enabled
                          </template>
                          <template v-else>
                            Disabled
                          </template>
                        </h3>
                        <h3 v-if="selectedUserWifiConnection.security_enabled == '1'" class="body-2 mb-0">
                          <v-icon color="primary" right>lock</v-icon>
                          Wifi Password : {{selectedUserWifiConnection.password}}
                        </h3>
                      </div>
                    </v-card-title>
                  </v-card>
                </v-flex>
              </v-container>
              <!--Add user wifi connection dialog-->
              <v-dialog v-model="addNewWifiConnectionCard" max-width="500px">
                <v-card>
                  <v-card-title>
                    <span class="headline">Add Wifi Connection</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container grid-list-md>
                      <v-form v-model="addNewWifiConnectionFormValid" ref="addNewWifiConnectionForm" lazy-validation>
                        <!--Connection name-->
                        <v-text-field
                          label="Connection Name"
                          :value="userWifiConnectionData.connectionName"
                          v-model="userWifiConnectionData.connectionName"
                          :rules="[() => !!userWifiConnectionData.connectionName || 'Connection name cannot leaved blank', () => userWifiConnectionData.connectionName.length <= 32 || 'Connection name can not be longer than 32 character']"
                          required
                          :counter="32"
                        ></v-text-field>
                        <!--SSID-->
                        <v-text-field
                          label="SSID"
                          :value="userWifiConnectionData.ssid"
                          v-model="userWifiConnectionData.ssid"
                          :rules="[() => !!userWifiConnectionData.ssid || 'SSID cannot leaved blank', () => userWifiConnectionData.ssid.length <= 32 || 'SSID can not be longer than 32 character']"
                          required
                          :counter="32"
                        ></v-text-field>
                        <!--Enable or disable wifi password -->
                        <v-layout wrap>
                          <v-flex xs12 sm6 md6>
                            <v-select
                              :items="securityEnabledSelectItem"
                              v-model="userWifiConnectionData.securityEnabled"
                              label="Wifi Security"
                              class="input-group--focused"
                              item-value="value"
                              required
                            ></v-select>
                          </v-flex>
                        </v-layout>
                        <!--If wifi password is enabled-->
                        <template v-if="userWifiConnectionData.securityEnabled == 1">
                          <v-text-field
                            label="Wifi Password"
                            :value="userWifiConnectionData.password"
                            v-model="userWifiConnectionData.password"
                            :rules="[() => !!userWifiConnectionData.password || 'Wifi Password cannot leaved blank', () => userWifiConnectionData.password.length <= 63 || 'Wifi Password can not be longer than 63 character',  ()=> userWifiConnectionData.password.length >= 8 || 'Password must be atleast 8 character']"
                            :counter="63"
                            required
                          ></v-text-field>
                        </template>
                      </v-form>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click.native="closeNewWifiConnectionCard">Cancel</v-btn>
                    <v-btn class="white--text" color="blue darken-1" :disabled="!addNewWifiConnectionFormValid" @click.native="onSubmitNewWifiConnection">Add</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-btn color="primary" flat @click.native="e1 = 3"  >Previous</v-btn>
              <v-btn color="primary" @click.native="showAddDeviceConfirmationDialog" :disabled="!selectedUserWifiConnection">Add device</v-btn>
              <!--Add new device confirmation dialog-->
              <v-dialog v-model="showAddDeviceConfirmation" max-width="400px">
                <v-card>
                  <v-card-title>
                    <span class="headline">Device Confirmation</span>
                  </v-card-title>
                  <v-card-text>
                    <span>Are you sure to add device <strong>{{deviceName}}</strong> ? , after adding the device <strong>you cannot change the sensor configuration</strong>, but you can still configure other things like naming and notification for each sensor.</span>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn flat large active-class color="teal" @click="showAddDeviceConfirmation = false">Cancel</v-btn>
                    <v-btn :disabled="!selectedUserWifiConnection" @click="onAddNewDevice" large active-class class="white--text" color="teal">Confirm</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
        <!--Snack bar-->
        <v-snackbar
          :timeout="addDeviceSnackTimeout"
          :color="addDeviceSnackColor"
          v-model="addDeviceSnack"
          :multi-line="true"
        >
          {{ addDeviceSnackMessage }}
          <v-btn dark flat @click.native="addDeviceSnack = false">Close</v-btn>
        </v-snackbar>
      </v-card>
    </v-flex>
  </v-layout>
</template>


<script>
  import {ADD_NEW_DEVICE_REQUEST, GET_SUPPORTED_BOARD_REQUEST, GET_SUPPORTED_SENSOR_REQUEST, GET_BOARD_PIN_OPTION_REQUEST} from '../store/actions/gudang'
  import {GET_USER_WIFI_CONNECTION_REQUEST, ADD_USER_WIFI_CONNECTION_REQUEST} from '../store/actions/lemari'
  import {loaded} from 'vue2-google-maps'

  export default {
    data () {
      return {
        // Add new device complete structure
        newDevice: {
          position: '',
          location_text: '',
          device_name: '',
          device_data_sending_interval: '',
          supported_board_uuid: '',
          added_sensors: [],
          user_wifi_connection_uuid: ''
        },
        showAddDeviceConfirmation: false,
        // Update sensor
        updateSensorCard: false,
        updateSensorDataTemp: '',
        updatedSensorIndex: '',
        // Time interval slider
        // Minimum value : 300
        dataSendingInterval: 5,
        // Add sensor
        addSensorCard: false,
        addedSensor: [],
        selectedSensor: '',
        selectedSensorOptions: [],
        addedSensorName: '',
        selectedBoardPinOption: '',
        supportedSensorListLoading: false,
        // Add device snack
        addDeviceSnack: false,
        addDeviceSnackMessage: '',
        addDeviceSnackColor: '',
        addDeviceSnackTimeout: 6000,
        // Add wifi connection
        securityEnabledSelectItem: [
          { text: 'Enabled', value: '1' },
          { text: 'Disabled', value: '0' }
        ],
        addNewWifiConnectionCard: false,
        addNewWifiConnectionFormValid: false,
        userWifiConnectionData: {
          userWifiConnectionUUID: '',
          connectionName: '',
          ssid: '',
          securityEnabled: '0',
          password: 'yourwifipassword'
        },
        // Wifi connection
        userWifiConnectionLoading: false,
        userWifiConnectionList: [],
        selectedUserWifiConnection: '',
        // Destination data items
        searchedAddress: '',
        searchedAddressObject: {},
        addDeviceMapCenter: {
          lat: 47.376332,
          lng: 8.547511
        },
        selectedDeviceLocation: '',
        deviceName: '',
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
        // User selected board
        selectedBoard: '',
        supportedBoardListLoading: false,
        supportedBoardList: [],
        supportedBoardCount: 0,
        supportedSensorList: [],
        supportedSensorCount: 0,
        select: {board_name: '', chip: ''},
        items: [
          {state: 'Florida', abbr: 'FL'},
          {state: 'Georgia', abbr: 'GA'},
          {state: 'Nebraska', abbr: 'NE'},
          {state: 'California', abbr: 'CA'},
          {state: 'New York', abbr: 'NY'}
        ]
      }
    },
    methods: {
      showAddDeviceConfirmationDialog: function () {
        this.showAddDeviceConfirmation = true
      },
      generateNewDeviceData: function () {
        // Put required data into newDevice
        this.newDevice.position = this.selectedDeviceLocation.position
        this.newDevice.location_text = this.searchedAddress
        this.newDevice.device_name = this.deviceName
        this.newDevice.device_data_sending_interval = this.dataSendingInterval
        this.newDevice.supported_board_uuid = this.selectedBoard.board_uuid
        this.newDevice.user_wifi_connection_uuid = this.selectedUserWifiConnection.user_wifi_connection_uuid
        // Put the added sensor
        this.newDevice.added_sensors = JSON.parse(JSON.stringify(this.addedSensor))
        // Move the master sensor uuid and remove the unrelevant data
        for (let i = 0; i < this.newDevice.added_sensors.length; i++) {
          this.newDevice.added_sensors[i].master_sensor_reference_uuid = this.newDevice.added_sensors[i].master_sensor_reference_data.master_sensor_reference_uuid
          delete this.newDevice.added_sensors[i].master_sensor_reference_data
          delete this.newDevice.added_sensors[i].random_uuid
        }
      },
      onAddNewDevice: function () {
        this.showAddDeviceConfirmation = false
        // Generate the device data
        this.generateNewDeviceData()
        try {
          const rootScope = this
          this.$store.dispatch(ADD_NEW_DEVICE_REQUEST, this.newDevice)
            .then((resp) => {
              this.generateSnack(resp.data.success.message, 'success')
              this.e1 = 1
              // Delay for 3 second
              setTimeout(function () { rootScope.$router.push('/mydevices') }, 3000)
            })
            .catch((err) => {
              this.generateSnack(err.response.data.error.message, 'error')
            })
        } catch (error) {
          // Display client error
          console.error(error)
        }
      },
      updateSensorData: function () {
        // Subtitute the data
        this.addedSensor[this.updatedSensorIndex] = this.updateSensorDataTemp
        // Reset update sensor data temp
        this.updateSensorDataTemp = ''
      },
      onUpdateSensorData: function (addedSensorIndex) {
        // Clone the object (using = will copy it by reference, use stringify instead)
        this.updateSensorDataTemp = JSON.parse(JSON.stringify(this.addedSensor[addedSensorIndex]))
        // Open update sensor card
        this.updateSensorCard = true
        // Load the option data
        const boardPinOptionData = {
          supportedBoardUUID: this.selectedBoard.board_uuid,
          masterSensorReferenceUUID: this.updateSensorDataTemp.master_sensor_reference_data.master_sensor_reference_uuid
        }
        this.loadBoardPinOption(boardPinOptionData)
        // Copy the index
        this.updatedSensorIndex = addedSensorIndex
      },
      appendAddedSensor: function () {
        let addedSensorData = {
          added_sensor_name: this.addedSensorName,
          master_sensor_reference_data: this.selectedSensor,
          sensor_pin_mappings: this.selectedSensorOptions,
          random_uuid: this.selectedBoardPinOption.random_uuid
        }
        // Push it into added sensor
        this.addedSensor.push(addedSensorData)
        // close the card
        this.addSensorCard = false
        // Reset selected Sensor Options
        this.selectedSensorOptions = []
        // Reset sensor name and model
        this.selectedSensor = ''
        this.addedSensorName = ''
        // Reset the selected sensor option
        this.selectedBoardPinOption = ''
      },
      openAddSensorCard: function () {
        this.addSensorCard = true
        // Remove the pin option
        this.selectedBoardPinOption = ''
      },
      closeAddSensorCard: function () {
        this.addSensorCard = false
        this.selectedSensor = ''
      },
      closeUpdateSensorCard: function () {
        this.updateSensorCard = false
        // Clear the temp
        this.updateSensorDataTemp = ''
      },
      openNewWifiConnectionCard: function () {
        this.addNewWifiConnectionCard = true
      },
      closeNewWifiConnectionCard: function () {
        this.addNewWifiConnectionCard = false
      },
      onSubmitNewWifiConnection: async function () {
        try {
          if (this.$refs.addNewWifiConnectionForm.validate()) {
            this.$store.dispatch(ADD_USER_WIFI_CONNECTION_REQUEST, this.userWifiConnectionData)
              .then((resp) => {
                this.generateSnack(resp.data.success.message, 'success')
                this.closeNewWifiConnectionCard()
                this.loadUserWifiConnectionList()
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
      updatePosition () {
        this.selectedDeviceLocation.position.lat = this.$refs.addDeviceMarkerRef.$markerObject.position.lat()
        this.selectedDeviceLocation.position.lng = this.$refs.addDeviceMarkerRef.$markerObject.position.lng()
      },
      setPlace (place) {
        this.latLng = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
      },
      loadUserWifiConnectionList: async function () {
        try {
          this.userWifiConnectionLoading = true
          this.$store.dispatch(GET_USER_WIFI_CONNECTION_REQUEST)
            .then((resp) => {
              this.userWifiConnectionList = this.$store.getters.getUserWifiConnectionList
              this.userWifiConnectionLoading = false
            })
        } catch (e) {
          // Display client error
          console.error(e)
        }
      },
      generateEmptySelectedBoardOptionArray: function (pinMapping) {
        let emptyArray = []
        for (let i = 0; i < pinMapping.length; i++) {
          emptyArray.push('')
        }
        this.selectedSensorOptions = emptyArray
      },
      generateSnack: function (message, color) {
        this.addDeviceSnackMessage = message
        this.addDeviceSnackColor = color
        this.addDeviceSnack = true
      },
      loadSupportedBoardList: async function () {
        this.supportedBoardListLoading = true
        try {
          this.$store.dispatch(GET_SUPPORTED_BOARD_REQUEST)
            .then((resp) => {
              // this.supportedBoardList = resp.data.data.supported_boards
              this.supportedBoardListLoading = false
              this.supportedBoardList = this.$store.getters.getSupportedBoardList.supported_boards
            })
        } catch (error) {
          // Display client error
          console.error(error)
        }
      },
      loadSupportedSensorList: async function () {
        try {
          // Loading bar
          this.supportedSensorListLoading = true
          this.$store.dispatch(GET_SUPPORTED_SENSOR_REQUEST)
            .then((resp) => {
              // Loading bar
              this.supportedSensorList = this.$store.getters.getSupportedSensorList.master_sensor_references
              this.supportedSensorListLoading = false
            })
        } catch (error) {
          // Display client error
          console.error(error)
        }
      },
      removeAddedSensor: function (index) {
        if (confirm('Remove Sensor : ' + this.addedSensor[index].added_sensor_name)) {
          this.addedSensor.splice(index, 1)
        }
      },
      loadAutoComplete () {
        /* eslint-disable */
        let methodScope = this
        loaded.then(() => {
          let self = this
          let searchedAddressInput = document.getElementById('searched_address')
          let searchedAddressAutoComplete = new google.maps.places.Autocomplete(searchedAddressInput)
          searchedAddressAutoComplete.addListener('place_changed', function () {
            let place = searchedAddressAutoComplete.getPlace()
            self.searchedAddressObject = {
              place
            }
            const address = []
            // Iterate through address_components
            for (let i = 0; i < place.address_components.length; i++) {
              address.push(place.address_components[i] && place.address_components[i].short_name || '')
            }
            address.join(' ')
            // Change searchedAddress Model so it will shows address selected
            self.searchedAddress = address.join(', ')
            // Update location marker
            self.selectedDeviceLocation = {
              position: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              }
            }
            self.addDeviceMapCenter.lat = place.geometry.location.lat()
            self.addDeviceMapCenter.lng = place.geometry.location.lng()
          })
        })
      },
      loadBoardPinOption: async function (requestData) {
        // This option only loaded when user already selected sensor
        // Loading bar
        this.supportedSensorListLoading = true
        // Reset board pin options
        this.selectedBoardPinOption = ''
        try {
          this.$store.dispatch(GET_BOARD_PIN_OPTION_REQUEST, requestData)
            .then((resp) => {
              this.selectedBoardPinOption = this.$store.getters.getBoardPinOption
              this.supportedSensorListLoading = false
              // Create empty array for sensor option
              this.generateEmptySelectedBoardOptionArray(this.selectedBoardPinOption.pin_mapping)
            })
          // Element will be computed instead
        } catch (error) {
          // Display client error
          console.error(error)
        }
      },
      selectedSensorOptionLength: function (selectedSensorOptions) {
        let length = 0
        for (let i = 0; i < selectedSensorOptions.length; i++) {
          if (selectedSensorOptions[i] != '') {
            length += 1
          }
        }
        return length
      },
      pinOptionValid: function () {
        if (this.selectedBoardPinOption) {
          return (this.selectedSensorOptionLength(this.selectedSensorOptions) == this.selectedBoardPinOption.pin_mapping.length)
        }
        else {
          return false
        }
      }
    },
    beforeMount () {
      this.loadSupportedBoardList()
      this.loadSupportedSensorList()
      this.loadUserWifiConnectionList()
    },
    mounted () {
      this.loadAutoComplete()
    },
    computed : {
      // To make sure all pin selected
      addSensorFormValid: {
        get: function () {
          return this.pinOptionValid() && this.addedSensorName && this.selectedSensor
        },
        set: function () {
          // TDo nothing
        }
      },
      // To make sure the name is typed in (All other field can't be nulled)
      updateSensorFormValid: {
        get: function () {
          return this.updateSensorDataTemp.added_sensor_name
        },
        set: function () {
          // TDo nothing
        }
      }

    },
    watch : {
      selectedSensor : function () {
        if(this.selectedSensor) {
          // Load the mapping options from BE
          const boardPinOptionData = {
            supportedBoardUUID: this.selectedBoard.board_uuid,
            masterSensorReferenceUUID: this.selectedSensor.master_sensor_reference_uuid
          }
          this.loadBoardPinOption(boardPinOptionData)

        }
      },
      selectedBoard: function () {
        // Reset selected sensor value
        this.selectedSensor = ''
      }
    }
  }
</script>
