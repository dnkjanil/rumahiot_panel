import {
  DEVICE_NOTIFICATION_LOG_LIST_REQUEST,
  DEVICE_NOTIFICATION_LOG_LIST_SUCCESS,
  DEVICE_NOTIFICATION_LOG_LIST_ERROR,
  CLEAR_SPECIFIC_DEVICE_NOTIFICATION_REQUEST,
  CLEAR_SPECIFIC_DEVICE_NOTIFICATION_SUCCESS,
  CLEAR_SPECIFIC_DEVICE_NOTIFICATION_ERROR,
  CLEAR_ALL_DEVICE_NOTIFICATION_REQUEST,
  CLEAR_ALL_DEVICE_NOTIFICATION_ERROR,
  CLEAR_ALL_DEVICE_NOTIFICATION_SUCCESS
} from '../actions/surat'

import {AUTH_SIGNOUT} from '../actions/sidik'
import axios from 'axios/index'

const state = {
  'getDeviceNotificationLogStatus': '',
  'clearSpecificDeviceNotificationLogStatus': '',
  'clearAllDeviceNotificationLogStatus': '',
  'userDeviceNotificationlogList': {}
}

const getters = {
  getDeviceNotificationList: state => state.userDeviceNotificationlogList,
  isDeviceNotificationListLoaded: state => !!state.getDeviceNotificationLogStatus
}

const actions = {
  [DEVICE_NOTIFICATION_LOG_LIST_REQUEST]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      commit(DEVICE_NOTIFICATION_LOG_LIST_REQUEST)
      const deviceNotificationLogListEndpoint = 'https://surat.rumahiot.panjatdigital.com/logger/device/sensor/notification/get/all'
      axios.get(deviceNotificationLogListEndpoint)
        .then(resp => {
          commit(DEVICE_NOTIFICATION_LOG_LIST_SUCCESS, resp.data.data)
          resolve(resp)
        })
        .catch(err => {
          commit(DEVICE_NOTIFICATION_LOG_LIST_ERROR)
          reject(err)
        })
    })
  },
  [CLEAR_SPECIFIC_DEVICE_NOTIFICATION_REQUEST]: ({commit, dispatch}, deviceNotificationLogUUID) => {
    return new Promise((resolve, reject) => {
      commit(DEVICE_NOTIFICATION_LOG_LIST_REQUEST)
      const clearSpecificDeviceNotificationLogEndpoint = 'https://surat.rumahiot.panjatdigital.com/logger/device/sensor/notification/clear/' + deviceNotificationLogUUID
      axios.get(clearSpecificDeviceNotificationLogEndpoint)
        .then(resp => {
          commit(CLEAR_SPECIFIC_DEVICE_NOTIFICATION_SUCCESS)
          resolve(resp)
        })
        .catch(err => {
          commit(CLEAR_SPECIFIC_DEVICE_NOTIFICATION_ERROR)
          reject(err)
        })
    })
  },
  [CLEAR_ALL_DEVICE_NOTIFICATION_REQUEST]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      commit(CLEAR_ALL_DEVICE_NOTIFICATION_REQUEST)
      const clearAllDeviceNotificationLogEndpoint = 'https://surat.rumahiot.panjatdigital.com/logger/device/sensor/notification/clearall'
      axios.get(clearAllDeviceNotificationLogEndpoint)
        .then(resp => {
          commit(CLEAR_ALL_DEVICE_NOTIFICATION_SUCCESS)
          resolve(resp)
        })
        .catch(err => {
          commit(CLEAR_ALL_DEVICE_NOTIFICATION_ERROR)
          reject(err)
        })
    })
  }
}

const mutations = {
  [AUTH_SIGNOUT]: (state) => {
    state.userDeviceNotificationlogList = {}
  },
  [DEVICE_NOTIFICATION_LOG_LIST_REQUEST]: (state) => {
    state.getDeviceNotificationLogStatus = 'loading'
  },
  [DEVICE_NOTIFICATION_LOG_LIST_SUCCESS]: (state, deviceNotificationLogList) => {
    state.getDeviceNotificationLogStatus = 'success'
    // Vue.set(state, 'userDeviceNotificationlogList', deviceNotificationLogList)
    state.userDeviceNotificationlogList = deviceNotificationLogList
  },
  [DEVICE_NOTIFICATION_LOG_LIST_ERROR]: (state) => {
    state.getDeviceNotificationLogStatus = 'error'
  },
  [CLEAR_SPECIFIC_DEVICE_NOTIFICATION_REQUEST]: (state) => {
    state.getDeviceNotificationLogStatus = 'loading'
  },
  [CLEAR_SPECIFIC_DEVICE_NOTIFICATION_SUCCESS]: (state) => {
    state.clearSpecificDeviceNotificationLogStatus = 'success'
  },
  [CLEAR_SPECIFIC_DEVICE_NOTIFICATION_ERROR]: (state) => {
    state.clearSpecificDeviceNotificationLogStatus = 'error'
  },
  [CLEAR_ALL_DEVICE_NOTIFICATION_REQUEST]: (state) => {
    state.clearAllDeviceNotificationLogStatus = 'loading'
  },
  [CLEAR_ALL_DEVICE_NOTIFICATION_SUCCESS]: (state) => {
    state.clearAllDeviceNotificationLogStatus = 'success'
    // Empty the list
    state.userDeviceNotificationlogList.device_notification_logs = []
    // Reset the notification count to 0
    state.userDeviceNotificationlogList.device_notification_logs_count = 0
  },
  [CLEAR_ALL_DEVICE_NOTIFICATION_ERROR]: (state) => {
    state.clearAllDeviceNotificationLogStatus = 'error'
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
