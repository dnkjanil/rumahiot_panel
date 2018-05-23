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
  GET_SENSOR_STATUS_ERROR

} from '../actions/gudang'

import {AUTH_SIGNOUT} from '../actions/sidik'
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
  'sensorStatusData': {}
}

const getters = {
  getDeviceList: state => state.userDeviceList,
  getSupportedBoardList: state => state.supportedBoardList,
  getSupportedSensorList: state => state.supportedSensorList,
  getBoardPinOption: state => state.boardPinOption,
  getUserDeviceChartData: state => state.userDeviceChartData,
  getSensorStatusData: state => state.sensorStatusData
}

const actions = {
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
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
