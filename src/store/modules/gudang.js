import {
  USER_DEVICE_LIST_ERROR,
  USER_DEVICE_LIST_REQUEST,
  USER_DEVICE_LIST_SUCCESS,
  UPDATE_USER_SENSOR_DETAIL_REQUEST,
  UPDATE_USER_SENSOR_DETAIL_ERROR,
  UPDATE_USER_SENSOR_DETAIL_SUCCESS
} from '../actions/gudang'

import {AUTH_SIGNOUT} from '../actions/sidik'
import axios from 'axios/index'
import Vue from 'vue'

const state = {
  'status': '',
  'updateSensorStatus': '',
  'userDeviceList': {}
}

const getters = {
  getDeviceList: state => state.userDeviceList,
  isDeviceListLoaded: state => !!state.status
}

const actions = {
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
          // TODO : MOVE THE DISPATCHER INTO AXIOS INTERCEPTOR
          dispatch(AUTH_SIGNOUT)
          reject(err)
        })
    })
  },
  [UPDATE_USER_SENSOR_DETAIL_REQUEST]: ({commit, dispatch}, newSensorDetail) => {
    return new Promise((resolve, reject) => {
      commit(UPDATE_USER_SENSOR_DETAIL_REQUEST)
      const updateUserSensorDetailEndpoint = 'http://localhost:8000/configure/device/sensor/detail/update'
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
    Vue.set(state, 'userDeviceList', userDeviceList)
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
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
