import {
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_ERROR,
  USER_PROFILE_UPDATE_REQUEST,
  USER_PROFILE_UPDATE_SUCCESS,
  USER_PROFILE_UPDATE_ERROR,
  USER_PROFILE_FULL_NAME_UPDATE,
  USER_PROFILE_PHONE_NUMBER_UPDATE,
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
  ADD_USER_WIFI_CONNECTION_ERROR,
  GET_DEVICE_DASHBOARD_CHART_REQUEST,
  GET_DEVICE_DASHBOARD_CHART_SUCCESS,
  GET_DEVICE_DASHBOARD_CHART_ERROR,
  ADD_DEVICE_DASHBOARD_CHART_REQUEST,
  ADD_DEVICE_DASHBOARD_CHART_SUCCESS,
  ADD_DEVICE_DASHBOARD_CHART_ERROR,
  REMOVE_DEVICE_DASHBOARD_CHART_REQUEST,
  REMOVE_DEVICE_DASHBOARD_CHART_SUCCESS,
  REMOVE_DEVICE_DASHBOARD_CHART_ERROR

} from '../actions/lemari'
import {AUTH_SIGNOUT} from '../actions/sidik'
import axios from 'axios'

const state = {
  'status': '',
  'userProfile': {},
  'updateProfileStatus': '',
  'userWifiConnectionList': {},
  'updateWifiConnectionStatus': '',
  'removeWifiConnectionStatus': '',
  'addWifiConnectionStatus': '',
  'userDeviceDashboardChart': {}
}

const getters = {
  getProfile: state => state.userProfile,
  isProfileLoaded: state => !!state.status,
  getUserWifiConnectionList: state => state.userWifiConnectionList,
  getuserDeviceDashboardChart: state => state.userWifiConnectionList
}

const actions = {
  [GET_DEVICE_DASHBOARD_CHART_REQUEST]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      commit(GET_DEVICE_DASHBOARD_CHART_REQUEST)
      const getdeviceDashboardChartEndpoint = 'https://lemari.rumahiot.panjatdigital.com/dashboard/chart/list'
      axios.get(getdeviceDashboardChartEndpoint)
        .then(resp => {
          commit(GET_DEVICE_DASHBOARD_CHART_SUCCESS, resp.data.data)
          resolve(resp)
        })
        .catch(err => {
          commit(GET_DEVICE_DASHBOARD_CHART_ERROR)
          reject(err)
        })
    })
  },
  [ADD_DEVICE_DASHBOARD_CHART_REQUEST]: ({commit, dispatch}, newDashboardChartData) => {
    return new Promise((resolve, reject) => {
      commit(ADD_DEVICE_DASHBOARD_CHART_REQUEST)
      const adddeviceDashboardChartEndpoint = 'https://lemari.rumahiot.panjatdigital.com/dashboard/chart/add'
      axios.post(adddeviceDashboardChartEndpoint, newDashboardChartData)
        .then(resp => {
          commit(ADD_DEVICE_DASHBOARD_CHART_SUCCESS)
          resolve(resp)
        })
        .catch(err => {
          commit(ADD_DEVICE_DASHBOARD_CHART_ERROR)
          reject(err)
        })
    })
  },
  [REMOVE_DEVICE_DASHBOARD_CHART_REQUEST]: ({commit, dispatch}, dashboardChartUUID) => {
    return new Promise((resolve, reject) => {
      commit(REMOVE_DEVICE_DASHBOARD_CHART_REQUEST)
      const removedeviceDashboardChartEndpoint = 'https://lemari.rumahiot.panjatdigital.com/dashboard/chart/remove/' + dashboardChartUUID
      axios.get(removedeviceDashboardChartEndpoint)
        .then(resp => {
          commit(REMOVE_DEVICE_DASHBOARD_CHART_SUCCESS)
          resolve(resp)
        })
        .catch(err => {
          commit(REMOVE_DEVICE_DASHBOARD_CHART_ERROR)
          reject(err)
        })
    })
  },
  [USER_PROFILE_REQUEST]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      commit(USER_PROFILE_REQUEST)
      const userProfileEndpoint = 'https://lemari.rumahiot.panjatdigital.com/profile/get'
      axios.get(userProfileEndpoint)
        .then(resp => {
          commit(USER_PROFILE_SUCCESS, resp.data.data)
          resolve(resp)
        })
        .catch(err => {
          commit(USER_PROFILE_ERROR)
          reject(err)
        })
    })
  },
  [USER_PROFILE_UPDATE_REQUEST]: ({commit, dispatch}, profileChanges) => {
    return new Promise((resolve, reject) => {
      commit(USER_PROFILE_UPDATE_REQUEST)
      const userProfileEndpoint = 'https://lemari.rumahiot.panjatdigital.com/profile/update'
      const fd = new FormData()
      fd.append('phone_number', profileChanges.userPhoneNumber)
      fd.append('full_name', profileChanges.userFullName)
      axios.post(userProfileEndpoint, fd)
        .then(resp => {
          commit(USER_PROFILE_UPDATE_SUCCESS, profileChanges)
          resolve(resp)
        })
        .catch(err => {
          commit(USER_PROFILE_UPDATE_ERROR)
          reject(err)
        })
    })
  },
  [USER_PROFILE_FULL_NAME_UPDATE]: ({commit}, newUserFullName) => {
    commit(USER_PROFILE_FULL_NAME_UPDATE, newUserFullName)
  },
  [USER_PROFILE_PHONE_NUMBER_UPDATE]: ({commit}, newUserPhoneNumber) => {
    commit(USER_PROFILE_PHONE_NUMBER_UPDATE, newUserPhoneNumber)
  },
  [GET_USER_WIFI_CONNECTION_REQUEST]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      commit(GET_USER_WIFI_CONNECTION_REQUEST)
      const getuserWifiConnectionEndpoint = 'https://lemari.rumahiot.panjatdigital.com/network/connection/wifi/list'
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
      const addUserWifiConnectionEndpoint = 'https://lemari.rumahiot.panjatdigital.com/network/connection/wifi/add'
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
      const updateUserWifiConnectionEndpoint = 'https://lemari.rumahiot.panjatdigital.com/network/connection/wifi/update'
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
      const removeUserWifiConnectionEndpoint = 'https://lemari.rumahiot.panjatdigital.com/network/connection/wifi/remove/' + userWifiConnectionUUID
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
  }
}

const mutations = {
  [USER_PROFILE_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [USER_PROFILE_SUCCESS]: (state, userProfile) => {
    state.status = 'success'
    state.userProfile = userProfile
  },
  [USER_PROFILE_ERROR]: (state) => {
    state.status = 'error'
  },
  [AUTH_SIGNOUT]: (state) => {
    state.userProfile = {}
  },
  [USER_PROFILE_UPDATE_REQUEST]: (state) => {
    state.updateProfileStatus = 'loading'
  },
  [USER_PROFILE_UPDATE_SUCCESS]: (state, profileChanges) => {
    state.updateProfileStatus = 'success'
    state.userProfile.full_name = profileChanges.userFullName
    state.userProfile.phone_number = profileChanges.userPhoneNumber
  },
  [USER_PROFILE_UPDATE_ERROR]: (state) => {
    state.updateProfileStatus = 'error'
  },
  [USER_PROFILE_FULL_NAME_UPDATE]: (state, newUserFullName) => {
    state.userProfile.full_name = newUserFullName
  },
  [USER_PROFILE_PHONE_NUMBER_UPDATE]: (state, newUserPhoneNumber) => {
    state.userProfile.phone_number = newUserPhoneNumber
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
  getters,
  actions,
  mutations
}
