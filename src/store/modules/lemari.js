import {
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_ERROR,
  USER_PROFILE_UPDATE_REQUEST,
  USER_PROFILE_UPDATE_SUCCESS,
  USER_PROFILE_UPDATE_ERROR
} from '../actions/lemari'
import {AUTH_SIGNOUT} from '../actions/sidik'
import axios from 'axios/index'
import Vue from 'vue'

const state = {
  'status': '',
  'userProfile': {},
  'updateProfileStatus': ''
}

const getters = {
  getProfile: state => state.user_profile,
  isProfileLoaded: state => !!state.user_profile
}

const actions = {
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
          // TODO : MOVE THE DISPATCHER INTO AXIOS INTERCEPTOR
          dispatch(AUTH_SIGNOUT)
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
          commit(USER_PROFILE_UPDATE_SUCCESS, resp.data.data)
          resolve(resp)
        })
        .catch(err => {
          commit(USER_PROFILE_UPDATE_ERROR)
          // TODO : MOVE THE DISPATCHER INTO AXIOS INTERCEPTOR
          dispatch(AUTH_SIGNOUT)
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
    Vue.set(state, 'userProfile', userProfile)
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
  [USER_PROFILE_UPDATE_SUCCESS]: (state) => {
    state.updateProfileStatus = 'success'
  },
  [USER_PROFILE_UPDATE_ERROR]: (state) => {
    state.updateProfileStatus = 'error'
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
