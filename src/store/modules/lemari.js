import {
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_ERROR,
  USER_PROFILE_UPDATE_REQUEST,
  USER_PROFILE_UPDATE_SUCCESS,
  USER_PROFILE_UPDATE_ERROR,
  USER_PROFILE_FULL_NAME_UPDATE,
  USER_PROFILE_PHONE_NUMBER_UPDATE

} from '../actions/lemari'
import {AUTH_SIGNOUT} from '../actions/sidik'
import axios from 'axios/index'

const state = {
  'status': '',
  'userProfile': {},
  'updateProfileStatus': ''
}

const getters = {
  getProfile: state => state.userProfile,
  isProfileLoaded: state => !!state.status
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
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
