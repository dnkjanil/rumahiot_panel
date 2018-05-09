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
  GET_USER_WIFI_CONNECTION_REQUEST,
  GET_USER_WIFI_CONNECTION_SUCCESS,
  GET_USER_WIFI_CONNECTION_ERROR,
  UPDATE_USER_WIFI_CONNECTION_REQUEST,
  UPDATE_USER_WIFI_CONNECTION_SUCCESS,
  UPDATE_USER_WIFI_CONNECTION_ERROR,
  REMOVE_USER_WIFI_CONNECTION_REQUEST,
  REMOVE_USER_WIFI_CONNECTION_SUCCESS,
  REMOVE_USER_WIFI_CONNECTION_ERROR,
  ADD_USER_WIFI_CONNECTION_REQUEST,
  ADD_USER_WIFI_CONNECTION_SUCCESS,
  ADD_USER_WIFI_CONNECTION_ERROR

} from '../actions/gudang'

import {AUTH_SIGNOUT} from '../actions/sidik'
import axios from 'axios'

const state = {
  'status': '',
  'updateSensorStatus': '',
  'userDeviceList': {},
  'supportedBoardList': {},
  'supportedSensorList': {},
  'userWifiConnectionList': {},
  'updateWifiConnectionStatus': '',
  'removeWifiConnectionStatus': '',
  'addWifiConnectionStatus': ''
}

const getters = {
  getDeviceList: state => state.userDeviceList,
  getSupportedBoardList: state => state.supportedBoardList,
  getSupportedSensorList: state => state.supportedSensorList,
  getUserWifiConnectionList: state => state.userWifiConnectionList
}

const actions = {
  [GET_USER_WIFI_CONNECTION_REQUEST]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      commit(GET_USER_WIFI_CONNECTION_REQUEST)
      const getuserWifiConnectionEndpoint = 'https://gudang.rumahiot.panjatdigital.com/retrieve/user/connection/wifi/list'
      axios.get(getuserWifiConnectionEndpoint)
        .then(resp => {
          commit(GET_USER_WIFI_CONNECTION_SUCCESS, resp.data.data.wifi_connections)
          resolve(resp)
        })
        .catch(err => {
          commit(GET_USER_WIFI_CONNECTION_ERROR)
          reject(err)
        })
    })
  },
  [ADD_USER_WIFI_CONNECTION_REQUEST]: ({commit, dispatch}, newWifiConnection) => {
    return new Promise((resolve, reject) => {
      commit(ADD_USER_WIFI_CONNECTION_REQUEST)
      const addUserWifiConnectionEndpoint = 'https://gudang.rumahiot.panjatdigital.com/configure/user/connection/wifi/add'
      const fd = new FormData()
      fd.append('connection_name', newWifiConnection.connectionName)
      fd.append('ssid', newWifiConnection.ssid)
      fd.append('security_enabled', newWifiConnection.securityEnabled)
      fd.append('password', newWifiConnection.password)
      axios.post(addUserWifiConnectionEndpoint, fd)
        .then(resp => {
          commit(ADD_USER_WIFI_CONNECTION_SUCCESS)
          resolve(resp)
        })
        .catch(err => {
          commit(ADD_USER_WIFI_CONNECTION_ERROR)
          reject(err)
        })
    })
  },
  [UPDATE_USER_WIFI_CONNECTION_REQUEST]: ({commit, dispatch}, wifiConnectionUpdate) => {
    return new Promise((resolve, reject) => {
      commit(UPDATE_USER_WIFI_CONNECTION_REQUEST)
      const updateUserWifiConnectionEndpoint = 'https://gudang.rumahiot.panjatdigital.com/configure/user/connection/wifi/update'
      const fd = new FormData()
      fd.append('connection_name', wifiConnectionUpdate.connectionName)
      fd.append('ssid', wifiConnectionUpdate.ssid)
      fd.append('security_enabled', wifiConnectionUpdate.securityEnabled)
      fd.append('password', wifiConnectionUpdate.password)
      fd.append('user_wifi_connection_uuid', wifiConnectionUpdate.userWifiConnectionUUID)
      axios.post(updateUserWifiConnectionEndpoint, fd)
        .then(resp => {
          commit(UPDATE_USER_WIFI_CONNECTION_SUCCESS)
          resolve(resp)
        })
        .catch(err => {
          commit(UPDATE_USER_WIFI_CONNECTION_ERROR)
          reject(err)
        })
    })
  },
  [REMOVE_USER_WIFI_CONNECTION_REQUEST]: ({commit, dispatch}, userWifiConnectionUUID) => {
    return new Promise((resolve, reject) => {
      commit(REMOVE_USER_WIFI_CONNECTION_REQUEST)
      const removeUserWifiConnectionEndpoint = 'https://gudang.rumahiot.panjatdigital.com/configure/user/connection/wifi/remove/' + userWifiConnectionUUID
      axios.get(removeUserWifiConnectionEndpoint)
        .then(resp => {
          commit(REMOVE_USER_WIFI_CONNECTION_SUCCESS)
          resolve(resp)
        })
        .catch(err => {
          commit(REMOVE_USER_WIFI_CONNECTION_ERROR)
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
  [ADD_USER_WIFI_CONNECTION_REQUEST]: (state) => {
    state.addWifiConnectionStatus = 'loading'
  },
  [ADD_USER_WIFI_CONNECTION_SUCCESS]: (state) => {
    state.addWifiConnectionStatus = 'success'
  },
  [ADD_USER_WIFI_CONNECTION_ERROR]: (state) => {
    state.addWifiConnectionStatus = 'error'
  },
  [GET_USER_WIFI_CONNECTION_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [GET_USER_WIFI_CONNECTION_SUCCESS]: (state, userWifiConnection) => {
    state.status = 'success'
    state.userWifiConnectionList = userWifiConnection
  },
  [GET_USER_WIFI_CONNECTION_ERROR]: (state) => {
    state.status = 'error'
  },
  [UPDATE_USER_WIFI_CONNECTION_REQUEST]: (state) => {
    state.updateWifiConnectionStatus = 'loading'
  },
  [UPDATE_USER_WIFI_CONNECTION_SUCCESS]: (state) => {
    state.updateWifiConnectionStatus = 'success'
  },
  [UPDATE_USER_WIFI_CONNECTION_ERROR]: (state) => {
    state.updateWifiConnectionStatus = 'error'
  },
  [REMOVE_USER_WIFI_CONNECTION_REQUEST]: (state) => {
    state.removeWifiConnectionStatus = 'loading'
  },
  [REMOVE_USER_WIFI_CONNECTION_SUCCESS]: (state) => {
    state.removeWifiConnectionStatus = 'success'
  },
  [REMOVE_USER_WIFI_CONNECTION_ERROR]: (state) => {
    state.removeWifiConnectionStatus = 'error'
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
