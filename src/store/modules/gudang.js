import {
  USER_DEVICE_LIST_ERROR,
  USER_DEVICE_LIST_REQUEST,
  USER_DEVICE_LIST_SUCCESS
} from '../actions/gudang'

import {AUTH_SIGNOUT} from '../actions/sidik'
import axios from 'axios/index'
import Vue from 'vue'

const state = {
  'status': '',
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
          console.log(err)
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
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
