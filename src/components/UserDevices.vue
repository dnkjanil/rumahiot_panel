<template>
  <v-layout justify-space-around wrap>
    <v-flex xs12 sm9 mt-3>
      <v-card>
        <!--Device list tab-->
        <v-tabs icons-and-text centered dark color="blue">
          <v-tabs-slider color="yellow"></v-tabs-slider>
          <v-tab href="#device-list">
            Device List
            <v-icon>fa-list-ul</v-icon>
          </v-tab>
          <v-tab href="#by-location">
            By Location
            <v-icon>fa-thumbtack</v-icon>
          </v-tab>
          <!--Device List Tab-->
          <v-tab-item id="device-list">
            <v-card>
              <v-card-title>
                <v-tooltip left>
                  <v-btn icon @click="refreshDeviceList" slot="activator">
                    <v-icon color="primary">
                      refresh
                    </v-icon>
                  </v-btn>
                  <span>Refresh device data</span>
                </v-tooltip>
                <span class="headline mb-1">My Devices</span><br>
                <v-spacer></v-spacer>
                <v-text-field
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                  v-model="deviceSearch"
                ></v-text-field>
              </v-card-title>
              <v-data-table
                :headers="tableHeaders"
                :items="userDevices"
                :search="deviceSearch"
                item-key="device_name"
                :loading="deviceTableLoading"
              >
                <!--Loading process-->
                <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
                <template slot="items" slot-scope="props">
                  <tr @click="props.expanded = !props.expanded">
                    <td><strong style="text-transform: uppercase;" class="primary--text">{{ props.item.device_name
                      }}</strong></td>
                    <td>{{ props.item.location_text }}</td>
                    <td>{{ timeConverter(props.item.time_added) }}</td>
                    <td>
                      <template v-if="props.item.over_threshold > 0">
                        <v-chip color="orange" text-color="white">
                          <v-avatar>
                            <v-icon>warning</v-icon>
                          </v-avatar>
                          {{props.item.quick_status}}
                        </v-chip>
                      </template>
                      <template v-else>
                        <v-chip color="green" text-color="white">
                          <v-avatar>
                            <v-icon>check_circle</v-icon>
                          </v-avatar>
                          {{props.item.quick_status}}
                        </v-chip>
                      </template>
                    </td>
                  </tr>
                </template>
                <v-alert slot="no-results" :value="true" color="error" icon="warning">
                  Your search for "{{ deviceSearch }}" found no results.
                </v-alert>
                <template slot="expand" slot-scope="props">
                  <!--Device detail card-->
                  <v-card flat>
                    <v-card-title primary-title>
                      <div>
                        <h3 class="title mb-0">{{props.item.device_name}}</h3>
                        <h5 class="subheading mb-0 primary--text">Attached Sensor</h5>
                      </div>
                    </v-card-title>
                    <v-layout column>
                      <v-container fluid grid-list-md>
                        <!--Card per sensor-->
                        <v-layout row wrap>
                          <v-flex
                            md3 xs6
                            v-for="sensorDetail in props.item.device_sensors"
                            :key="sensorDetail.user_sensor_uuid"
                          >
                          <!--If the threshold is enabled-->
                            <template v-if="sensorDetail.threshold_enabled">
                              <template v-if="sensorDetail.threshold_direction == '1'">
                                  <v-card hover v-if="sensorDetail.latest_value > sensorDetail.sensor_threshold"  color="grey lighten-4">
                                    <v-card-title primary-title>
                                      <div>
                                        <h3 class="subheading mb-0 primary--text">{{sensorDetail.user_sensor_name}}</h3>
                                        <h3 class="body-2 mb-0">
                                          <v-icon color="primary" right>label_outline</v-icon>
                                          Sensor : {{sensorDetail.sensor_model}}
                                        </h3>
                                        <h3 class="body-2 mb-0">
                                          <v-icon color="primary" right>view_module</v-icon>
                                          Value Type : {{sensorDetail.master_sensor_name}}
                                        </h3>
                                        <h3 class="body-2 mb-0">
                                          <v-icon color="primary" right>autorenew</v-icon>
                                          Latest Sensor Value : {{sensorDetail.latest_value}}{{sensorDetail.unit_symbol}}
                                        </h3>
                                        <h3 class="body-2 mb-0 ">
                                          <v-icon color="primary" right>alarm_on</v-icon>
                                          Threshold Value : {{sensorDetail.sensor_threshold}}{{sensorDetail.unit_symbol}}
                                        </h3>
                                      </div>
                                    </v-card-title>
                                    <v-card-actions>
                                      <v-spacer></v-spacer>
                                      <!--Threshold direction symbol-->
                                      <v-tooltip bottom v-if="sensorDetail.threshold_direction == '1'">
                                        <v-icon dark color="primary" slot="activator">vertical_align_top</v-icon>
                                        <span>{{deviceListTooltip.aboveThreshold}}</span>
                                      </v-tooltip>
                                      <v-tooltip bottom v-else-if="sensorDetail.threshold_direction == '-1'">
                                        <v-icon dark color="primary" slot="activator">vertical_align_bottom</v-icon>
                                        <span>{{deviceListTooltip.belowThreshold}}</span>
                                      </v-tooltip>
                                      <v-tooltip bottom>
                                        <v-icon dark color="orange" slot="activator">warning</v-icon>
                                        <span>{{deviceListTooltip.warning}}</span>
                                      </v-tooltip>
                                      <v-btn icon class="mx-0" @click="editUserSensor(sensorDetail)">
                                        <v-icon color="blue">edit</v-icon>
                                      </v-btn>
                                    </v-card-actions>
                                  </v-card>
                                  <v-card hover v-else color="grey lighten-4">
                                    <v-card-title primary-title>
                                      <div>
                                        <h3 class="subheading mb-0 primary--text">{{sensorDetail.user_sensor_name}}</h3>
                                        <h3 class="body-2 mb-0">
                                          <v-icon color="primary" right>label_outline</v-icon>
                                          Sensor : {{sensorDetail.sensor_model}}
                                        </h3>
                                        <h3 class="body-2 mb-0">
                                          <v-icon color="primary" right>view_module</v-icon>
                                          Value Type : {{sensorDetail.master_sensor_name}}
                                        </h3>
                                        <h3 class="body-2 mb-0">
                                          <v-icon color="primary" right>autorenew</v-icon>
                                          Latest Sensor Value : {{sensorDetail.latest_value}}{{sensorDetail.unit_symbol}}
                                        </h3>
                                        <h3 class="body-2 mb-0 ">
                                          <v-icon color="primary" right>alarm_on</v-icon>
                                          Threshold Value : {{sensorDetail.sensor_threshold}}{{sensorDetail.unit_symbol}}
                                        </h3>
                                      </div>
                                    </v-card-title>
                                    <v-card-actions>
                                      <v-spacer></v-spacer>
                                      <!--Threshold direction symbol-->
                                      <v-tooltip bottom v-if="sensorDetail.threshold_direction == '1'">
                                        <v-icon dark color="primary" slot="activator">vertical_align_top</v-icon>
                                        <span>{{deviceListTooltip.aboveThreshold}}</span>
                                      </v-tooltip>
                                      <v-tooltip bottom v-else-if="sensorDetail.threshold_direction == '-1'">
                                        <v-icon dark color="primary" slot="activator">vertical_align_bottom</v-icon>
                                        <span>{{deviceListTooltip.belowThreshold}}</span>
                                      </v-tooltip>
                                      <v-tooltip bottom>
                                        <v-icon dark color="green" slot="activator">check_circle</v-icon>
                                        <span>{{deviceListTooltip.normal}}</span>
                                      </v-tooltip>
                                      <v-btn icon class="mx-0" @click="editUserSensor(sensorDetail)">
                                        <v-icon color="blue">edit</v-icon>
                                      </v-btn>
                                    </v-card-actions>
                                  </v-card>
                              </template>
                              <template v-else-if="sensorDetail.threshold_direction == '-1'">
                                <v-card hover v-if="sensorDetail.latest_value < sensorDetail.sensor_threshold"  color="grey lighten-4">
                                  <v-card-title primary-title>
                                    <div>
                                      <h3 class="subheading mb-0 primary--text">{{sensorDetail.user_sensor_name}}</h3>
                                      <h3 class="body-2 mb-0">
                                        <v-icon color="primary" right>label_outline</v-icon>
                                        Sensor : {{sensorDetail.sensor_model}}
                                      </h3>
                                      <h3 class="body-2 mb-0">
                                        <v-icon color="primary" right>view_module</v-icon>
                                        Value Type : {{sensorDetail.master_sensor_name}}
                                      </h3>
                                      <h3 class="body-2 mb-0">
                                        <v-icon color="primary" right>autorenew</v-icon>
                                        Latest Sensor Value : {{sensorDetail.latest_value}}{{sensorDetail.unit_symbol}}
                                      </h3>
                                      <h3 class="body-2 mb-0 ">
                                        <v-icon color="primary" right>alarm_on</v-icon>
                                        Threshold Value : {{sensorDetail.sensor_threshold}}{{sensorDetail.unit_symbol}}
                                      </h3>
                                    </div>
                                  </v-card-title>
                                  <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <!--Threshold direction symbol-->
                                    <v-tooltip bottom v-if="sensorDetail.threshold_direction == '1'">
                                      <v-icon dark color="primary" slot="activator">vertical_align_top</v-icon>
                                      <span>{{deviceListTooltip.aboveThreshold}}</span>
                                    </v-tooltip>
                                    <v-tooltip bottom v-else-if="sensorDetail.threshold_direction == '-1'">
                                      <v-icon dark color="primary" slot="activator">vertical_align_bottom</v-icon>
                                      <span>{{deviceListTooltip.belowThreshold}}</span>
                                    </v-tooltip>

                                    <v-tooltip bottom>
                                      <v-icon dark color="orange" slot="activator">warning</v-icon>
                                      <span>{{deviceListTooltip.warning}}</span>
                                    </v-tooltip>
                                    <v-btn icon class="mx-0" @click="editUserSensor(sensorDetail)">
                                      <v-icon color="blue">edit</v-icon>
                                    </v-btn>
                                  </v-card-actions>
                                </v-card>
                                <v-card  hover v-else color="grey lighten-4">
                                  <v-card-title primary-title>
                                    <div>
                                      <h3 class="subheading mb-0 primary--text">{{sensorDetail.user_sensor_name}}</h3>
                                      <h3 class="body-2 mb-0">
                                        <v-icon color="primary" right>label_outline</v-icon>
                                        Sensor : {{sensorDetail.sensor_model}}
                                      </h3>
                                      <h3 class="body-2 mb-0">
                                        <v-icon color="primary" right>view_module</v-icon>
                                        Value Type : {{sensorDetail.master_sensor_name}}
                                      </h3>
                                      <h3 class="body-2 mb-0">
                                        <v-icon color="primary" right>autorenew</v-icon>
                                        Latest Sensor Value : {{sensorDetail.latest_value}}{{sensorDetail.unit_symbol}}
                                      </h3>
                                      <h3 class="body-2 mb-0 ">
                                        <v-icon color="primary" right>alarm_on</v-icon>
                                        Threshold Value : {{sensorDetail.sensor_threshold}}{{sensorDetail.unit_symbol}}
                                      </h3>
                                    </div>
                                  </v-card-title>
                                  <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <!--Threshold direction symbol-->
                                    <v-tooltip bottom v-if="sensorDetail.threshold_direction == '1'">
                                      <v-icon dark color="primary" slot="activator">vertical_align_top</v-icon>
                                      <span>{{deviceListTooltip.aboveThreshold}}</span>
                                    </v-tooltip>
                                    <v-tooltip bottom v-else-if="sensorDetail.threshold_direction == '-1'">
                                      <v-icon dark color="primary" slot="activator">vertical_align_bottom</v-icon>
                                      <span>{{deviceListTooltip.belowThreshold}}</span>
                                    </v-tooltip>

                                    <v-tooltip bottom>
                                      <v-icon dark color="green" slot="activator">check_circle</v-icon>
                                      <span>{{deviceListTooltip.normal}}</span>
                                    </v-tooltip>
                                    <v-btn icon class="mx-0" @click="editUserSensor(sensorDetail)">
                                      <v-icon color="blue">edit</v-icon>
                                    </v-btn>
                                  </v-card-actions>
                                </v-card>
                              </template>
                            </template>
                            <!--If the threshold not enabled-->
                            <template v-else-if="!sensorDetail.threshold_enabled">
                                <v-card color="grey lighten-4"
                                        hover
                                >
                                  <v-card-title primary-title >
                                    <div>
                                      <h3 class="subheading mb-0 primary--text">{{sensorDetail.user_sensor_name}}</h3>
                                      <h3 class="body-2 mb-0">
                                        <v-icon color="primary" right>label_outline</v-icon>
                                        Sensor : {{sensorDetail.sensor_model}}
                                      </h3>
                                      <h3 class="body-2 mb-0">
                                        <v-icon color="primary" right>view_module</v-icon>
                                        Value Type : {{sensorDetail.master_sensor_name}}
                                      </h3>
                                      <h3 class="body-2 mb-0">
                                        <v-icon color="primary" right>autorenew</v-icon>
                                        Latest Sensor Value : {{sensorDetail.latest_value}}{{sensorDetail.unit_symbol}}
                                      </h3>
                                    </div>
                                  </v-card-title>
                                  <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-tooltip bottom>
                                      <v-icon dark color="primary" slot="activator">info</v-icon>
                                      <span>{{deviceListTooltip.disabled}}</span>
                                    </v-tooltip>
                                    <v-btn icon class="mx-0" @click="editUserSensor(sensorDetail)">
                                      <v-icon color="blue">edit</v-icon>
                                    </v-btn>
                                  </v-card-actions>
                                </v-card>
                            </template>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-layout>
                    <v-btn color="primary" class="mb-4">Configure This Device
                      <v-icon small right dark>settings</v-icon>
                    </v-btn>
                    <v-btn @click="onShowUserSensorMapping(props.item.device_uuid)" color="pink" class="white--text mb-4">Sensor Mapping
                      <v-icon small right dark>fa-thumbtack</v-icon>
                    </v-btn>
                    <v-btn @click="getDeviceArduinoSourceCode(props.item)" color="teal" class="white--text mb-4">Arduino Project Source
                      <v-icon small right dark>fa-file-code</v-icon>
                    </v-btn>
                    <v-btn @click="onRemoveUserDevice(props.item.device_uuid, props.item.device_name)" color="red" class="white--text mb-4">Remove Device
                      <v-icon small right dark>fa-trash-alt </v-icon>
                    </v-btn>
                  </v-card>
                </template>
              </v-data-table>
            </v-card>
          </v-tab-item>
          <!-- Device by location tab -->
          <v-tab-item id="by-location">
            <v-card flat>
              <gmap-map
                :center="center"
                :zoom="7"
                style="width: 100%; height: 450px"
                ref="deviceMap"
              >
                <!--Gmap Tool-Tip-->
                <gmap-info-window :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen"
                                  @closeclick="infoWinOpen=false">
                  <v-tabs
                    centered
                    color="blue"
                    dark
                    height="50"
                    slider-color="yellow"
                  >
                    <v-tab ripple href="#sensor-info">
                      <v-icon>fa-tachometer-alt</v-icon>
                    </v-tab>
                    <v-tab ripple href="#location-info">
                      <v-icon>fa-compass</v-icon>
                    </v-tab>
                    <!--Sensor Info-->
                    <v-tab-item id="sensor-info">
                      <v-card
                        width="400"
                        flat
                      >
                        <v-card-title primary-title>
                          <div>
                            <span class="headline mb-1">{{deviceName}}</span><br>
                            <a class="title">Overview</a>
                          </div>
                        </v-card-title>
                        <v-container
                          style="max-height: 300px"
                          class="scroll-y">
                          <v-list two-line>
                            <template v-for="sensor in deviceSensors">
                              <v-list-tile avatar ripple :key="sensor.user_sensor_uuid" @click="">
                                <v-list-tile-content>
                                  <v-list-tile-title>{{sensor.user_sensor_name}}</v-list-tile-title>
                                  <v-list-tile-sub-title class="text--primary">Latest Sensor Value :
                                    {{sensor.latest_value}}{{sensor.unit_symbol}}
                                  </v-list-tile-sub-title>
                                  <v-list-tile-sub-title>Sensor Threshold :
                                    {{sensor.sensor_threshold}}{{sensor.unit_symbol}}
                                  </v-list-tile-sub-title>
                                  <v-list-tile-sub-title>Value Type :
                                    {{sensor.master_sensor_name}}
                                  </v-list-tile-sub-title>
                                </v-list-tile-content>
                                <!--If Threshold is enabled-->
                                <template v-if="sensor.threshold_enabled">
                                  <!--If threshold direction is 1-->
                                  <template v-if="sensor.threshold_direction == '1'">
                                    <!--If the sensor value over the threshold value-->
                                    <v-list-tile-action v-if="sensor.latest_value > sensor.sensor_threshold">
                                      <v-chip color="orange" text-color="white">
                                        <v-avatar>
                                          <v-icon>warning</v-icon>
                                        </v-avatar>
                                        Warning
                                      </v-chip>
                                    </v-list-tile-action>
                                    <v-list-tile-action v-else>
                                      <v-chip color="green" text-color="white">
                                        <v-avatar>
                                          <v-icon>check_circle</v-icon>
                                        </v-avatar>
                                        Normal
                                      </v-chip>
                                    </v-list-tile-action>
                                  </template>
                                  <!--If threshold direction is -1-->
                                  <template v-else>
                                    <!--If the sensor value over the threshold value-->
                                    <v-list-tile-action v-if="sensor.latest_value < sensor.sensor_threshold">
                                      <v-chip color="orange" text-color="white">
                                        <v-avatar>
                                          <v-icon>warning</v-icon>
                                        </v-avatar>
                                        Warning
                                      </v-chip>
                                    </v-list-tile-action>
                                    <v-list-tile-action v-else>
                                      <v-chip color="green" text-color="white">
                                        <v-avatar>
                                          <v-icon>check_circle</v-icon>
                                        </v-avatar>
                                        Normal
                                      </v-chip>
                                    </v-list-tile-action>
                                  </template>
                                </template>
                                <!--If threshold is disabled-->
                                <template v-else>
                                  <v-list-tile-action>
                                    <v-chip color="primary" text-color="white">
                                      <v-avatar>
                                        <v-icon>info</v-icon>
                                      </v-avatar>
                                      Disabled
                                    </v-chip>
                                  </v-list-tile-action>
                                </template>
                              </v-list-tile>
                              <v-divider></v-divider>
                            </template>
                          </v-list>
                        </v-container>
                        <v-btn flat depressed small color="primary">Configure This Device</v-btn>
                      </v-card>
                    </v-tab-item>
                    <!--Location info-->
                    <v-tab-item id="location-info">
                      <v-card
                        width="400"
                        flat
                      >
                        <v-card-title primary-title>
                          <div>
                            <span class="headline mb-1">{{deviceName}}</span><br>
                            <a class="title mb-1">Location Detail</a><br/><br/>
                          </div>
                          <div>
                            <span class="subheading">{{deviceLocationtext}}</span><br/><br/>
                            <span>Lattitude : {{infoWindowPos.lat}}</span><br/>
                            <span>Longitude : {{infoWindowPos.lng}}</span>
                          </div>
                        </v-card-title>
                        <v-btn flat depressed small color="primary">Configure This Device</v-btn>
                      </v-card>
                    </v-tab-item>
                  </v-tabs>
                </gmap-info-window>
                <gmap-marker
                  :key="i"
                  v-for="(m,i) in markers"
                  :position="m.position"
                  :clickable="true"
                  @click="toggleInfoWindow(m,i)"
                ></gmap-marker>
              </gmap-map>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-card>
      <!--Edit sensor dialog-->
      <v-dialog v-model="editSensorDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Update Sensor Detail</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-form v-model="editSensorFormValid" ref="editSensorForm" lazy-validation>
                <v-text-field
                  label="Sensor Name"
                  :value="editedSensor.userSensorName"
                  v-model="editedSensor.userSensorName"
                  :rules="[() => !!editedSensor.userSensorName || 'Sensor name cannot leaved blank', () => editedSensor.userSensorName.length <= 32 || 'Sensor name can not be longer than 32 character']"
                  required
                  :counter="32"
                ></v-text-field>
              <!--Enable or disable threshold -->
              <v-layout wrap>
                <v-flex xs12 sm6 md6>
                  <v-select
                    :items="thresholdSelectItem"
                    v-model="editedSensor.userSensorThresholdEnabled"
                    label="Threshold Notification"
                    class="input-group--focused"
                    item-value="value"
                    required
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6 md6>
                <span> When Enabled you are going to get <strong>Email notification</strong> when the latest sensor value goes <strong>over the set threshold</strong></span>
                </v-flex>
              </v-layout>

              <!--If threshold is enabled-->
              <template v-if="editedSensor.userSensorThresholdEnabled == 1">
                <v-layout wrap>
                  <!--Threshold direction-->
                <v-flex xs12 sm6 md6>
                  <v-select
                    :items="thresholdDirectionSelectItem"
                    v-model="editedSensor.userSensorThresholdDirection"
                    label="Threshold Direction"
                    class="input-group--focused"
                    item-value="value"
                    required
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <span> Threshold direction specify the <strong>direction</strong> of the threshold value, <strong>Above</strong> means that you will be <strong>notified</strong> when the value is going <strong>above the threshold</strong>, while <strong>Below</strong> will notify you when the value is going <strong>below the set threshold</strong></span>
                </v-flex>
                </v-layout>
                <!--Threshold Value-->
                <v-layout wrap>
                  <v-flex xs12 sm6 md5>
                  <v-text-field
                      label="Sensor Threshold "
                      :value="editedSensor.userSensorThreshold"
                      v-model="editedSensor.userSensorThreshold"
                      :rules="[() => !!editedSensor.userSensorThreshold || 'Sensor threshold cannot leaved blank']"
                      :suffix="editedSensor.userSensorUnitSymbol"
                      required
                  ></v-text-field>
                  </v-flex>
                </v-layout>
              </template>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="closeEditUserSensorDialog">Cancel</v-btn>
            <v-btn class="white--text" color="blue darken-1" :disabled="!editSensorFormValid" @click.native="submitEditUserSensor">Update</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--Show sensor pin mapping-->
      <v-dialog v-model="showUserSensorMappingDialog" max-width="700px">
        <v-flex v-if="!selectedUserSensorMapping" md9 sm12 class="text-xs-center">
          <!--Loading card-->
          <v-card>
            <v-progress-circular width="500" :size="70" :width="7" indeterminate color="primary"></v-progress-circular>
          </v-card>
        </v-flex>
        <!--Main card-->
        <v-card v-else>
          <v-card-title>
            <span class="headline">Sensor Mapping</span>
          </v-card-title>
          <v-card-text>
            <template v-for="mappingData in selectedUserSensorMapping.sensor_mapping_datas">
              <h5 class="title mb-0 primary--text">{{mappingData.master_sensor_reference.sensor_model}}</h5>
              <br/>
              <v-data-table
                :headers="sensorMappingHeaders"
                :items="mappingData.pin_mappings"
                hide-actions
                class="elevation-1"
              >
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.sensor_pin }}</td>
                  <td>{{ props.item.device_pin_name }}</td>
                  <td>{{ props.item.function }}</td>
                </template>
              </v-data-table>
              <br>
            </template>
          </v-card-text>
        </v-card>
      </v-dialog>
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
          :to="{'name' : 'AddUserDevice'}"
        >
          <v-icon>add</v-icon>
        </v-btn>
        <span>Add new device</span>
      </v-tooltip>
    </v-flex>
    <!--Snackbar-->
    <v-snackbar
      :timeout="deviceListSnackTimeOut"
      :color="deviceListSnackColor"
      v-model="deviceListSnack"
      :multi-line="true"
    >
      {{ deviceListSnackMessage }}
      <v-btn dark flat @click.native="deviceListSnack = false">Close</v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
  /* eslint-disable no-undef */

  import {REMOVE_USER_DEVICE_REQUEST, USER_DEVICE_LIST_REQUEST, UPDATE_USER_SENSOR_DETAIL_REQUEST, GET_DEVICE_ARDUINO_SOURCE_CODE_REQUEST, GET_USER_SENSOR_MAPPING_REQUEST} from '../store/actions/gudang'
  import {AUTH_SIGNOUT} from '../store/actions/sidik'

  export default {
    data () {
      return {
        myDeviceSpeedDial: false,
        editSensorFormValid: false,
        deviceListTooltip: {
          warning: 'Latest value goes over threshold',
          normal: 'Latest value is normal',
          disabled: 'Threshold is disabled',
          aboveThreshold: 'You will be notified when the sensor value is above the set threshold',
          belowThreshold: 'You will be notified when the sensor value is below the set threshold'
        },
        editSensorDialog: false,
        editedSensor: {
          userSensorName: '',
          userSensorThreshold: 0,
          userSensorUUID: '',
          userSensorThresholdEnabled: '',
          userSensorThresholdDirection: '',
          userSensorUnitSymbol: ''
        },
        thresholdSelectItem: [
          { text: 'Enabled', value: '1' },
          { text: 'Disabled', value: '0' }
        ],
        thresholdDirectionSelectItem: [
          { text: 'Above', value: '1' },
          { text: 'Below', value: '-1' }
        ],
        cards: [
          {title: 'Pre-fab homes', src: '/static/doc-images/cards/house.jpg'},
          {title: 'Favorite road trips', src: '/static/doc-images/cards/road.jpg'}
        ],
        sensorMappingHeaders: [
          {
            text: 'Sensor Pin',
            align: 'left',
            value: 'device_pin_name',
            sortable: false
          },
          {
            text: 'Device Pin',
            align: 'left',
            value: 'device_pin_name',
            sortable: false
          },
          {
            text: 'Function',
            align: 'left',
            value: 'function',
            sortable: false
          }
        ],
        deviceTableLoading: true,
        center: {
          lat: -6.948877,
          lng: 110.38932850000003
        },
        // Snackbar
        deviceListSnack: false,
        deviceListSnackMessage: '',
        deviceListSnackColor: '',
        deviceListSnackTimeOut: 6000,
        deviceName: '',
        deviceLocationtext: '',
        deviceSensors: [],
        infoWindowPos: {
          lat: 0,
          lng: 0
        },
        infoWinOpen: false,
        currentMidx: null,
        //  optional: offset infowindow so it visually sits nicely on top of our marker
        infoOptions: {
          pixelOffset: {
            width: 0,
            height: -35
          }
        },
        markers: [],
        deviceSearch: '',
        tableHeaders: [
          {
            text: 'Device Name',
            align: 'left',
            value: 'device_name'
          },
          {
            text: 'Location',
            value: 'location_text',
            align: 'left'
          },
          {
            text: 'Date added',
            value: 'time_added',
            align: 'left'
          },
          {
            text: 'Quick Status',
            value: 'quick_status',
            align: 'left'
          }
        ],
        userDevices: [],
        showUserSensorMappingDialog: false,
        selectedUserSensorMapping: ''
      }
    },
    methods: {
      onRemoveUserDevice: async function (deviceUUID, deviceName) {
        if (confirm('Remove device : ' + deviceName + ' ?')) {
          this.$store.dispatch(REMOVE_USER_DEVICE_REQUEST, deviceUUID)
            .then((resp) => {
              this.generateSnack(resp.data.success.message, 'success')
              this.loadUserDevice()
              this.deviceTableLoading = false
            })
            .catch((err) => {
              this.generateSnack(err.response.data.error.message, 'error')
              this.deviceTableLoading = false
            })
        }
      },
      onShowUserSensorMapping: async function (deviceUUID) {
        // Open the dialog
        this.selectedUserSensorMapping = ''
        this.showUserSensorMappingDialog = true
        this.$store.dispatch(GET_USER_SENSOR_MAPPING_REQUEST, deviceUUID)
          .then(resp => {
            this.selectedUserSensorMapping = resp.data.data
          })
      },
      getDeviceArduinoSourceCode: async function (item) {
        const deviceData = {
          deviceUUID: item.device_uuid,
          deviceName: item.device_name
        }
        this.$store.dispatch(GET_DEVICE_ARDUINO_SOURCE_CODE_REQUEST, deviceData)
      },
      // Refresh device list
      refreshDeviceList: function () {
        this.loadUserDevice()
      },
      // When the marker is clicked
      toggleInfoWindow: function (marker, idx) {
        this.infoWindowPos = marker.position
        this.deviceName = marker.device_name
        this.deviceLocationtext = marker.location_text
        this.deviceSensors = marker.device_sensors
        //  check if its the same marker that was selected if yes toggle
        if (this.currentMidx === idx) {
          this.infoWinOpen = !this.infoWinOpen
        } else {
          this.infoWinOpen = true
          this.currentMidx = idx
        }
      },
      timeConverter: function (unixTimeStamp) {
        // Convert unix time stamp into regular date
        const date = new Date(unixTimeStamp * 1000)
        return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear()
      },
      editUserSensor: function (userSensor) {
        this.editedSensor.userSensorName = userSensor.user_sensor_name
        this.editedSensor.userSensorThreshold = parseFloat(userSensor.sensor_threshold)
        this.editedSensor.userSensorUUID = userSensor.user_sensor_uuid
        // Convert from booelan value from the service into 1 and 0
        if (userSensor.threshold_enabled) {
          this.editedSensor.userSensorThresholdEnabled = '1'
        } else {
          this.editedSensor.userSensorThresholdEnabled = '0'
        }
        this.editedSensor.userSensorThresholdDirection = userSensor.threshold_direction
        this.editedSensor.userSensorUnitSymbol = userSensor.unit_symbol
        this.editSensorDialog = true
      },
      generateSnack: function (message, color) {
        this.deviceListSnackMessage = message
        this.deviceListSnackColor = color
        this.deviceListSnack = true
      },
      closeEditUserSensorDialog () {
        this.editSensorDialog = false
      },
      submitEditUserSensor: async function () {
        try {
          this.deviceTableLoading = true
          this.$store.dispatch(UPDATE_USER_SENSOR_DETAIL_REQUEST, this.editedSensor)
            .then((resp) => {
              this.closeEditUserSensorDialog()
              this.generateSnack(resp.data.success.message, 'success')
              this.loadUserDevice()
              this.deviceTableLoading = false
            })
            .catch((err) => {
              this.closeEditUserSensorDialog()
              this.generateSnack(err.response.data.error.message, 'error')
              this.deviceTableLoading = false
            })
        } catch (error) {
          // Display client error
          console.error(error)
        }
      },
      loadUserDevice: async function () {
        try {
          const searchParameter = {
            // Default value
            'page': '',
            'limit': '',
            'query': ''
          }
          this.deviceTableLoading = true
          this.$store.dispatch(USER_DEVICE_LIST_REQUEST, searchParameter)
            .then((resp) => {
              // Put the marker from the result
              this.markers = this.$store.getters.getDeviceList.results
              // Put the result into userDevices
              this.userDevices = this.$store.getters.getDeviceList.results
              // Change the load sttus into false
              this.deviceTableLoading = false
            })
            .catch(() => {
              this.$store.dispatch(AUTH_SIGNOUT)
                .then(() => {
                  this.$router.push('/signin')
                })
            })
        } catch (error) {
          // Display client error
          console.error(error)
        }
      }
    },
    beforeMount () {
      this.loadUserDevice()
    }
  }
</script>
