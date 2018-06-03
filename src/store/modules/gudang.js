import {
  USER_DEVICE_LIST_ERROR,
  USER_DEVICE_LIST_REQUEST,
  USER_DEVICE_LIST_SUCCESS,
  UPDATE_USER_SENSOR_DETAIL_REQUEST,
  UPDATE_USER_SENSOR_DETAIL_ERROR,
  UPDATE_USER_SENSOR_DETAIL_SUCCESS,
  GET_SUPPORTED_BOARD_REQUEST,
  GET_SUPPORTED_BOARD_SUCCESS,
  GET_SUPPORTED_BOARD_ERROR,
  GET_SUPPORTED_SENSOR_REQUEST,
  GET_SUPPORTED_SENSOR_SUCCESS,
  GET_SUPPORTED_SENSOR_ERROR,
  GET_BOARD_PIN_OPTION_REQUEST,
  GET_BOARD_PIN_OPTION_SUCCESS,
  GET_BOARD_PIN_OPTION_ERROR,
  ADD_NEW_DEVICE_REQUEST,
  ADD_NEW_DEVICE_SUCCESS,
  ADD_NEW_DEVICE_ERROR,
  GET_DEVICE_CHART_DATA_REQUEST,
  GET_DEVICE_CHART_DATA_SUCCESS,
  GET_DEVICE_CHART_DATA_ERROR,
  GET_SENSOR_STATUS_REQUEST,
  GET_SENSOR_STATUS_SUCCESS,
  GET_SENSOR_STATUS_ERROR,
  GET_USER_SIMPLE_DEVICE_LIST_REQUEST,
  GET_USER_SIMPLE_DEVICE_LIST_SUCCESS,
  GET_USER_SIMPLE_DEVICE_LIST_ERROR,
  GET_DEVICE_MONTHLY_CHART_REQUEST,
  GET_DEVICE_MONTHLY_CHART_SUCCESS,
  GET_DEVICE_MONTHLY_CHART_ERROR,
  GET_DEVICE_YEARLY_CHART_REQUEST,
  GET_DEVICE_YEARLY_CHART_SUCCESS,
  GET_DEVICE_YEARLY_CHART_ERROR,
  GET_DEVICE_CUSTOM_CHART_REQUEST,
  GET_DEVICE_CUSTOM_CHART_SUCCESS,
  GET_DEVICE_CUSTOM_CHART_ERROR,
  GET_TIMEZONES_REQUEST,
  GET_TIMEZONES_SUCCESS,
  GET_TIMEZONES_ERROR,
  ADD_NEW_DEVICE_EXPORTED_DATA_REQUEST,
  ADD_NEW_DEVICE_EXPORTED_DATA_SUCCESS,
  ADD_NEW_DEVICE_EXPORTED_DATA_ERROR,
  GET_DEVICE_ARDUINO_SOURCE_CODE_REQUEST,
  GET_DEVICE_ARDUINO_SOURCE_CODE_SUCCESS,
  GET_DEVICE_ARDUINO_SOURCE_CODE_ERROR,
  GET_USER_SENSOR_MAPPING_REQUEST,
  GET_USER_SENSOR_MAPPING_SUCCESS,
  GET_USER_SENSOR_MAPPING_ERROR

} from '../actions/gudang'

import {AUTH_SIGNOUT} from '../actions/sidik'
import FileSaver from 'file-saver'
import axios from 'axios'

const state = {
  'status': '',
  'updateSensorStatus': '',
  'addNewDeviceStatus': '',
  'userDeviceList': {},
  'supportedBoardList': {},
  'supportedSensorList': {},
  'boardPinOption': {},
  'userDeviceChartData': {},
  'sensorStatusData': {},
  'userSimpleDeviceList': {},
  'userDashboardChartData': {},
  'timezoneList': {}
}

const getters = {
  getDeviceList: state => state.userDeviceList,
  getSupportedBoardList: state => state.supportedBoardList,
  getSupportedSensorList: state => state.supportedSensorList,
  getBoardPinOption: state => state.boardPinOption,
  getUserDeviceChartData: state => state.userDeviceChartData,
  getSensorStatusData: state => state.sensorStatusData,
  getSimpleDeviceList: state => state.userSimpleDeviceList,
  getUserDashboardChartData: state => state.userDashboardChartData,
  getTimezoneList: state => state.timezoneList
}

const actions = {
  // Doesnt need a state
  [GET_USER_SENSOR_MAPPING_REQUEST]: ({commit, dispatch}, deviceUUID) => {
    return new Promise((resolve, reject) => {
      commit(GET_USER_SENSOR_MAPPING_REQUEST)
      const getUserSensorMappingEndpoint = 'https://gudang.rumahiot.panjatdigital.com/retrieve/sensor/mapping/' + deviceUUID
      axios.get(getUserSensorMappingEndpoint)
        .then(resp => {
          commit(GET_USER_SENSOR_MAPPING_SUCCESS)
          resolve(resp)
        })
        .catch(err => {
          commit(GET_USER_SENSOR_MAPPING_ERROR)
          reject(err)
        })
    })
  },
  [GET_DEVICE_ARDUINO_SOURCE_CODE_REQUEST]: ({commit, dispatch}, deviceData) => {
    return new Promise((resolve, reject) => {
      commit(GET_DEVICE_ARDUINO_SOURCE_CODE_REQUEST)
      const getDeviceArduinoSourceCodeEndpoint = 'https://gudang.rumahiot.panjatdigital.com/retrieve/device/arduino/code/' + deviceData.deviceUUID
      axios.get(getDeviceArduinoSourceCodeEndpoint, {responseType: 'blob'})
        .then(resp => {
          const fileName = 'rumahiot_' + deviceData.deviceName.split(' ').join('_').toLowerCase() + '.ino'
          FileSaver.saveAs(resp.data, fileName)
          commit(GET_DEVICE_ARDUINO_SOURCE_CODE_SUCCESS)
          resolve(resp)
        })
        .then(err => {
          commit(GET_DEVICE_ARDUINO_SOURCE_CODE_ERROR)
          reject(err)
        })
    })
  },
  [ADD_NEW_DEVICE_EXPORTED_DATA_REQUEST]: ({commit, dispatch}, requestData) => {
    return new Promise((resolve, reject) => {
      commit(ADD_NEW_DEVICE_EXPORTED_DATA_REQUEST)
      const addNewDeviceExportedDataEndpoint = 'https://gudang.rumahiot.panjatdigital.com/store/exported/device/data/xlsx/new'
      const fd = new FormData()
      fd.append('device_uuid', requestData.deviceUUID)
      fd.append('from_time', requestData.fromTime)
      fd.append('to_time', requestData.toTime)
      fd.append('time_zone', requestData.timezone)
      axios.post(addNewDeviceExportedDataEndpoint, fd)
        .then(resp => {
          commit(ADD_NEW_DEVICE_EXPORTED_DATA_SUCCESS)
          resolve(resp)
        })
        .catch(err => {
          commit(ADD_NEW_DEVICE_EXPORTED_DATA_ERROR)
          reject(err)
        })
    })
  },
  [GET_TIMEZONES_REQUEST]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      commit(GET_USER_SIMPLE_DEVICE_LIST_REQUEST)
      const getTimezoneListEndpoint = 'https://gudang.rumahiot.panjatdigital.com/retrieve/timezone/list'
      axios.get(getTimezoneListEndpoint)
        .then(resp => {
          commit(GET_TIMEZONES_SUCCESS, resp.data.data)
          resolve(resp)
        })
        .catch(err => {
          commit(GET_TIMEZONES_ERROR)
          reject(err)
        })
    })
  },
  [GET_DEVICE_CUSTOM_CHART_REQUEST]: ({commit, dispatch}, requestData) => {
    return new Promise((resolve, reject) => {
      commit(GET_DEVICE_YEARLY_CHART_REQUEST)
      const getDeviceCustomStatisticEndpoint = 'https://gudang.rumahiot.panjatdigital.com/retrieve/device/data/statistic?divider=' + requestData.divider + '&ft=' + requestData.fromTime + '&tt=' + requestData.toTime + '&device_uuid=' + requestData.deviceUUID
      axios.get(getDeviceCustomStatisticEndpoint)
        .then(resp => {
          let deviceDashboardChartData = {}
          let deviceStatisticData = resp.data.data
          // Add the labels
          let statisticLabels = []
          // for (let i = 0; i < requestData.divider; i++) {
          //   let label = ''
          //   deviceStatisticData.device_data_statistics[i]
          //   statisticLabels.push(i)
          // }
          // Take the label from the first sensor, as the rest will be the same
          for (let i = 0; i < deviceStatisticData.device_data_statistics[0].statistic_values.length; i++) {
            let date = new Date(deviceStatisticData.device_data_statistics[0].statistic_values[i].to_time * 1000)
            statisticLabels.push(('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear() + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2))
          }
          deviceDashboardChartData['labels'] = statisticLabels
          // Add options
          deviceDashboardChartData['options'] = {
            responsive: true,
            maintainAspectRatio: false,
            title: {
              display: true,
              text: 'Device ' + deviceStatisticData.device_name + ' average data for the last ' + requestData.divider + ' hour'
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
                display: false,
                scaleLabel: {
                  display: true,
                  labelString: 'Time'
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
          // Add datasets
          let datasets = []
          // Iterate through the sensor
          for (let i = 0; i < deviceStatisticData.total_user_sensor; i++) {
            let dataset = {
              fill: false,
              borderColor: deviceStatisticData.random_material_colors[i],
              backgroundColor: deviceStatisticData.random_material_colors[i],
              label: deviceStatisticData.device_data_statistics[i].user_sensor_name + ' (' + deviceStatisticData.device_data_statistics[i].unit_name + ', ' + deviceStatisticData.device_data_statistics[i].unit_symbol + ')'
            }
            let data = []
            for (let j = 0; j < deviceStatisticData.device_data_statistics[i].statistic_values.length; j++) {
              data.push(deviceStatisticData.device_data_statistics[i].statistic_values[j].avg_sensor_value)
            }
            // Push it into dataset
            dataset['data'] = data
            // Push it into datasets
            datasets.push(dataset)
          }
          // Add datasets into main object
          deviceDashboardChartData['datasets'] = datasets
          // Put it into the store
          let chartData = {
            userDashboardChartUUID: requestData.userDashboardChartUUID,
            data: deviceDashboardChartData
          }
          commit(GET_DEVICE_CUSTOM_CHART_SUCCESS, chartData)
          resolve(resp)
        })
        .catch(err => {
          commit(GET_DEVICE_CUSTOM_CHART_ERROR)
          reject(err)
        })
    })
  },
  [GET_DEVICE_YEARLY_CHART_REQUEST]: ({commit, dispatch}, requestData) => {
    return new Promise((resolve, reject) => {
      commit(GET_DEVICE_YEARLY_CHART_REQUEST)
      const getDeviceYearlyStatisticEndpoint = 'https://gudang.rumahiot.panjatdigital.com/retrieve/device/data/statistic/yearly?year=' + requestData.year + '&device_uuid=' + requestData.deviceUUID
      axios.get(getDeviceYearlyStatisticEndpoint)
        .then(resp => {
          let deviceDashboardChartData = {}
          let deviceStatisticData = resp.data.data
          // Add the labels
          deviceDashboardChartData['labels'] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          // Add options
          deviceDashboardChartData['options'] = {
            responsive: true,
            maintainAspectRatio: false,
            title: {
              display: true,
              text: 'Device ' + deviceStatisticData.device_name + ' average yearly data for ' + deviceStatisticData.year
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
          // Add datasets
          let datasets = []
          // Iterate through the sensor
          for (let i = 0; i < deviceStatisticData.total_user_sensor; i++) {
            let dataset = {
              fill: false,
              borderColor: deviceStatisticData.random_material_colors[i],
              backgroundColor: deviceStatisticData.random_material_colors[i],
              label: deviceStatisticData.device_data_statistics[i].user_sensor_name + ' (' + deviceStatisticData.device_data_statistics[i].unit_name + ', ' + deviceStatisticData.device_data_statistics[i].unit_symbol + ')'
            }
            let data = []
            for (let j = 0; j < deviceStatisticData.device_data_statistics[i].statistic_values.length; j++) {
              data.push(deviceStatisticData.device_data_statistics[i].statistic_values[j].avg_sensor_value)
            }
            // Push it into dataset
            dataset['data'] = data
            // Push it into datasets
            datasets.push(dataset)
          }
          // Add datasets into main object
          deviceDashboardChartData['datasets'] = datasets
          // Put it into the store
          let chartData = {
            userDashboardChartUUID: requestData.userDashboardChartUUID,
            data: deviceDashboardChartData
          }
          commit(GET_DEVICE_YEARLY_CHART_SUCCESS, chartData)
          resolve(resp)
        })
        .catch(err => {
          commit(GET_DEVICE_YEARLY_CHART_ERROR)
          reject(err)
        })
    })
  },
  [GET_DEVICE_MONTHLY_CHART_REQUEST]: ({commit, dispatch}, requestData) => {
    return new Promise((resolve, reject) => {
      commit(GET_DEVICE_MONTHLY_CHART_REQUEST)
      const getDeviceMonthlyStatisticEndpoint = 'https://gudang.rumahiot.panjatdigital.com/retrieve/device/data/statistic/monthly?year=' + requestData.year + '&month=' + requestData.month + '&device_uuid=' + requestData.deviceUUID
      axios.get(getDeviceMonthlyStatisticEndpoint)
        .then(resp => {
          let deviceDashboardChartData = {}
          let deviceStatisticData = resp.data.data
          // Month name
          const monthName = {
            1: 'January',
            2: 'February',
            3: 'March',
            4: 'April',
            5: 'May',
            6: 'June',
            7: 'July',
            8: 'August',
            9: 'September',
            10: 'October',
            11: 'November',
            12: 'December'
          }
          // Add labels
          let statisticLabels = []
          for (let i = 1; i <= deviceStatisticData.total_days; i++) {
            statisticLabels.push(i)
          }
          deviceDashboardChartData['labels'] = statisticLabels
          // Add options
          deviceDashboardChartData['options'] = {
            responsive: true,
            maintainAspectRatio: false,
            title: {
              display: true,
              text: 'Device ' + deviceStatisticData.device_name + ' Average monthly data for ' + monthName[deviceStatisticData.month] + ' ' + deviceStatisticData.year
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
                  labelString: 'Day'
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
          // Add datasets
          let datasets = []
          // Iterate through the sensor
          for (let i = 0; i < deviceStatisticData.total_user_sensor; i++) {
            let dataset = {
              fill: false,
              borderColor: deviceStatisticData.random_material_colors[i],
              backgroundColor: deviceStatisticData.random_material_colors[i],
              label: deviceStatisticData.device_data_statistics[i].user_sensor_name + ' (' + deviceStatisticData.device_data_statistics[i].unit_name + ', ' + deviceStatisticData.device_data_statistics[i].unit_symbol + ')'
            }
            let data = []
            for (let j = 0; j < deviceStatisticData.device_data_statistics[i].statistic_values.length; j++) {
              data.push(deviceStatisticData.device_data_statistics[i].statistic_values[j].avg_sensor_value)
            }
            // Push it into dataset
            dataset['data'] = data
            // Push it into datasets
            datasets.push(dataset)
          }
          // Add datasets into main object
          deviceDashboardChartData['datasets'] = datasets
          // Put it into the store
          let chartData = {
            userDashboardChartUUID: requestData.userDashboardChartUUID,
            data: deviceDashboardChartData
          }
          commit(GET_DEVICE_MONTHLY_CHART_SUCCESS, chartData)
          resolve(resp)
        })
        .catch(err => {
          commit(GET_DEVICE_MONTHLY_CHART_ERROR)
          reject(err)
        })
    })
  },
  [GET_USER_SIMPLE_DEVICE_LIST_REQUEST]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      commit(GET_USER_SIMPLE_DEVICE_LIST_REQUEST)
      const getSimpleDeviceListEndpoint = 'https://gudang.rumahiot.panjatdigital.com/retrieve/device/list/simple'
      axios.get(getSimpleDeviceListEndpoint)
        .then(resp => {
          commit(GET_USER_SIMPLE_DEVICE_LIST_SUCCESS, resp.data.data)
          resolve(resp)
        })
        .catch(err => {
          commit(GET_USER_SIMPLE_DEVICE_LIST_ERROR)
          reject(err)
        })
    })
  },
  [GET_SENSOR_STATUS_REQUEST]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      commit(GET_SENSOR_STATUS_REQUEST)
      const getSensorStatusEndpoint = 'https://gudang.rumahiot.panjatdigital.com/retrieve/device/sensor/status/chart'
      axios.get(getSensorStatusEndpoint)
        .then(resp => {
          commit(GET_SENSOR_STATUS_SUCCESS, resp.data.data)
          resolve(resp)
        })
        .catch(err => {
          commit(GET_SENSOR_STATUS_ERROR)
          reject(err)
        })
    })
  },
  [GET_DEVICE_CHART_DATA_REQUEST]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      commit(GET_DEVICE_CHART_DATA_REQUEST)
      const getDeviceChartDataEndpoint = 'https://gudang.rumahiot.panjatdigital.com/retrieve/device/data/count/chart'
      axios.get(getDeviceChartDataEndpoint)
        .then(resp => {
          commit(GET_DEVICE_CHART_DATA_SUCCESS, resp.data.data)
          resolve(resp)
        })
        .catch(err => {
          commit(GET_DEVICE_CHART_DATA_ERROR)
          reject(err)
        })
    })
  },
  [ADD_NEW_DEVICE_REQUEST]: ({commit, dispatch}, newDevice) => {
    return new Promise((resolve, reject) => {
      commit(ADD_NEW_DEVICE_REQUEST)
      const addNewDeviceEndpoint = 'https://gudang.rumahiot.panjatdigital.com/store/device/new'
      axios.post(addNewDeviceEndpoint, newDevice)
        .then(resp => {
          commit(ADD_NEW_DEVICE_SUCCESS)
          resolve(resp)
        })
        .catch(err => {
          commit(ADD_NEW_DEVICE_ERROR)
          reject(err)
        })
    })
  },
  [GET_SUPPORTED_BOARD_REQUEST]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      commit(GET_SUPPORTED_SENSOR_REQUEST)
      const getSupportedBoardListEndpoint = 'https://gudang.rumahiot.panjatdigital.com/retrieve/board/supported/list'
      axios.get(getSupportedBoardListEndpoint)
        .then(resp => {
          commit(GET_SUPPORTED_BOARD_SUCCESS, resp.data.data)
          resolve(resp)
        })
        .catch(err => {
          commit(GET_SUPPORTED_BOARD_ERROR)
          reject(err)
        })
    })
  },
  [GET_SUPPORTED_SENSOR_REQUEST]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      commit(GET_SUPPORTED_SENSOR_REQUEST)
      const getSupportedSensorListEndpoint = 'https://gudang.rumahiot.panjatdigital.com/retrieve/sensor/master/reference/list'
      axios.get(getSupportedSensorListEndpoint)
        .then(resp => {
          commit(GET_SUPPORTED_SENSOR_SUCCESS, resp.data.data)
          resolve(resp)
        })
        .catch(err => {
          commit(GET_SUPPORTED_BOARD_ERROR)
          reject(err)
        })
    })
  },
  [USER_DEVICE_LIST_REQUEST]: ({commit, dispatch}, searchParameter) => {
    return new Promise((resolve, reject) => {
      commit(USER_DEVICE_LIST_REQUEST)
      const userDeviceListEndpoint = 'https://gudang.rumahiot.panjatdigital.com/retrieve/device/list?p=' + searchParameter.page + '&l=' + searchParameter.limit + '&q=' + searchParameter.query
      axios.get(userDeviceListEndpoint)
        .then(resp => {
          commit(USER_DEVICE_LIST_SUCCESS, resp.data.data)
          resolve(resp)
        })
        .catch(err => {
          commit(USER_DEVICE_LIST_ERROR)
          reject(err)
        })
    })
  },
  [UPDATE_USER_SENSOR_DETAIL_REQUEST]: ({commit, dispatch}, newSensorDetail) => {
    return new Promise((resolve, reject) => {
      commit(UPDATE_USER_SENSOR_DETAIL_REQUEST)
      const updateUserSensorDetailEndpoint = 'https://gudang.rumahiot.panjatdigital.com/configure/device/sensor/detail/update'
      const fd = new FormData()
      fd.append('new_threshold', newSensorDetail.userSensorThreshold)
      fd.append('threshold_enabled', newSensorDetail.userSensorThresholdEnabled)
      fd.append('new_user_sensor_name', newSensorDetail.userSensorName)
      fd.append('user_sensor_uuid', newSensorDetail.userSensorUUID)
      fd.append('threshold_direction', newSensorDetail.userSensorThresholdDirection)
      axios.post(updateUserSensorDetailEndpoint, fd)
        .then(resp => {
          commit(UPDATE_USER_SENSOR_DETAIL_SUCCESS)
          resolve(resp)
        })
        .catch(err => {
          commit(UPDATE_USER_SENSOR_DETAIL_ERROR)
          reject(err)
        })
    })
  },
  [GET_BOARD_PIN_OPTION_REQUEST]: ({commit, dispatch}, boardPinOptionData) => {
    return new Promise((resolve, reject) => {
      commit(GET_BOARD_PIN_OPTION_REQUEST)
      const getBoardPinOptionEndpoint = 'https://gudang.rumahiot.panjatdigital.com/retrieve/board/pin/options?board_uuid=' + boardPinOptionData.supportedBoardUUID + '&sensor_uuid=' + boardPinOptionData.masterSensorReferenceUUID
      axios.get(getBoardPinOptionEndpoint)
        .then(resp => {
          commit(GET_BOARD_PIN_OPTION_SUCCESS, resp.data.data)
          resolve(resp)
        })
        .catch(err => {
          commit(GET_BOARD_PIN_OPTION_ERROR)
          reject(err)
        })
    })
  }

}

const mutations = {
  [AUTH_SIGNOUT]: (state) => {
    state.userDeviceList = {}
  },
  [USER_DEVICE_LIST_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [USER_DEVICE_LIST_SUCCESS]: (state, userDeviceList) => {
    state.status = 'success'
    state.userDeviceList = userDeviceList
  },
  [USER_DEVICE_LIST_ERROR]: (state) => {
    state.status = 'error'
  },
  [UPDATE_USER_SENSOR_DETAIL_REQUEST]: (state) => {
    state.updateSensorStatus = 'loading'
  },
  [UPDATE_USER_SENSOR_DETAIL_ERROR]: (state) => {
    state.updateSensorStatus = 'error'
  },
  [UPDATE_USER_SENSOR_DETAIL_SUCCESS]: (state) => {
    state.updateSensorStatus = 'success'
  },
  [GET_SUPPORTED_BOARD_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [GET_SUPPORTED_BOARD_SUCCESS]: (state, supportedBoardList) => {
    state.status = 'success'
    state.supportedBoardList = supportedBoardList
  },
  [GET_SUPPORTED_BOARD_ERROR]: (state) => {
    state.status = 'error'
  },
  [GET_SUPPORTED_SENSOR_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [GET_SUPPORTED_SENSOR_SUCCESS]: (state, supportedSensorList) => {
    state.status = 'success'
    state.supportedSensorList = supportedSensorList
  },
  [GET_SUPPORTED_SENSOR_ERROR]: (state) => {
    state.status = 'error'
  },
  [GET_BOARD_PIN_OPTION_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [GET_BOARD_PIN_OPTION_SUCCESS]: (state, pinMapping) => {
    state.status = 'success'
    state.boardPinOption = pinMapping
  },
  [GET_BOARD_PIN_OPTION_ERROR]: (state) => {
    state.status = 'error'
  },
  [ADD_NEW_DEVICE_REQUEST]: (state) => {
    state.addNewDeviceStatus = 'loading'
  },
  [ADD_NEW_DEVICE_SUCCESS]: (state) => {
    state.addNewDeviceStatus = 'success'
  },
  [ADD_NEW_DEVICE_ERROR]: (state) => {
    state.addNewDeviceStatus = 'error'
  },
  [GET_DEVICE_CHART_DATA_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [GET_DEVICE_CHART_DATA_SUCCESS]: (state, deviceChartData) => {
    state.userDeviceChartData = deviceChartData
    state.status = 'success'
  },
  [GET_DEVICE_CHART_DATA_ERROR]: (state) => {
    state.status = 'error'
  },
  [GET_SENSOR_STATUS_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [GET_SENSOR_STATUS_SUCCESS]: (state, sensorStatusData) => {
    state.sensorStatusData = sensorStatusData
    state.status = 'success'
  },
  [GET_SENSOR_STATUS_ERROR]: (state) => {
    state.status = 'error'
  },
  [GET_USER_SIMPLE_DEVICE_LIST_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [GET_USER_SIMPLE_DEVICE_LIST_SUCCESS]: (state, simpleDeviceList) => {
    state.status = 'success'
    state.userSimpleDeviceList = simpleDeviceList
  },
  [GET_USER_SIMPLE_DEVICE_LIST_ERROR]: (state) => {
    state.status = 'error'
  },
  [GET_DEVICE_MONTHLY_CHART_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [GET_DEVICE_MONTHLY_CHART_SUCCESS]: (state, chartData) => {
    state.status = 'success'
    state.userDashboardChartData[chartData.userDashboardChartUUID] = chartData.data
  },
  [GET_DEVICE_MONTHLY_CHART_ERROR]: (state) => {
    state.status = 'error'
  },
  [GET_DEVICE_YEARLY_CHART_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [GET_DEVICE_YEARLY_CHART_SUCCESS]: (state, chartData) => {
    state.status = 'success'
    state.userDashboardChartData[chartData.userDashboardChartUUID] = chartData.data
  },
  [GET_DEVICE_YEARLY_CHART_ERROR]: (state) => {
    state.status = 'error'
  },
  [GET_DEVICE_CUSTOM_CHART_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [GET_DEVICE_CUSTOM_CHART_SUCCESS]: (state, chartData) => {
    state.status = 'success'
    state.userDashboardChartData[chartData.userDashboardChartUUID] = chartData.data
  },
  [GET_DEVICE_CUSTOM_CHART_ERROR]: (state) => {
    state.status = 'error'
  },
  [GET_TIMEZONES_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [GET_TIMEZONES_SUCCESS]: (state, timezoneData) => {
    state.status = 'success'
    state.timezoneList = timezoneData
  },
  [GET_TIMEZONES_ERROR]: (state) => {
    state.status = 'error'
  },
  [ADD_NEW_DEVICE_EXPORTED_DATA_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [ADD_NEW_DEVICE_EXPORTED_DATA_SUCCESS]: (state) => {
    state.status = 'success'
  },
  [ADD_NEW_DEVICE_EXPORTED_DATA_ERROR]: (state) => {
    state.status = 'error'
  },
  [GET_DEVICE_ARDUINO_SOURCE_CODE_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [GET_DEVICE_ARDUINO_SOURCE_CODE_SUCCESS]: (state) => {
    state.status = 'success'
  },
  [GET_DEVICE_ARDUINO_SOURCE_CODE_ERROR]: (state) => {
    state.status = 'error'
  },
  [GET_USER_SENSOR_MAPPING_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [GET_USER_SENSOR_MAPPING_SUCCESS]: (state) => {
    state.status = 'success'
  },
  [GET_USER_SENSOR_MAPPING_ERROR]: (state) => {
    state.status = 'error'
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
