import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_SIGNOUT,
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_ERROR, REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_ERROR
}
  from '../actions/sidik'

import axios from 'axios'

const state = {
  token: localStorage.getItem('rumahiot-token') || '',
  changePasswordStatus: '',
  status: ''
}

const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status
}

const actions = {
  [REGISTER_REQUEST]: ({commit, dispatch}, newUserData) => {
    return new Promise((resolve, reject) => {
      commit(REGISTER_REQUEST)
      const emailRegistrationEndpoint = 'https://sidik.rumahiot.panjatdigital.com/authenticate/email/register'
      const fd = new FormData()
      fd.append('full_name', newUserData.fullName)
      fd.append('email', newUserData.email)
      fd.append('password', newUserData.password)
      fd.append('retype_password', newUserData.retypePassword)
      fd.append('g-recaptcha-response', newUserData.recaptchaResponse)
      axios.post(emailRegistrationEndpoint, fd)
        .then(resp => {
          commit(REGISTER_SUCCESS)
          resolve(resp)
        })
        .catch(err => {
          commit(REGISTER_ERROR)
          reject(err)
        })
    })
  },
  [AUTH_REQUEST]: ({commit, dispatch}, user) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_REQUEST)
      const emailAuthenticationEndpoint = 'https://sidik.rumahiot.panjatdigital.com/authenticate/email'
      const fd = new FormData()
      fd.append('email', user.email)
      fd.append('password', user.password)
      axios.post(emailAuthenticationEndpoint, fd)
        .then(response => {
          const token = response.data.data.token
          // Put the token into local storage when the login is success
          localStorage.setItem('rumahiot-token', response.data.data.token)
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
          commit(AUTH_SUCCESS, token)
          resolve(response)
        })
        .catch(err => {
          commit(AUTH_ERROR)
          // Remove old token in local storage
          localStorage.removeItem('rumahiot-token')
          reject(err)
        })
    })
  },
  [AUTH_SIGNOUT]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      // Remove from localstorage and axios header
      localStorage.removeItem('rumahiot-token')
      delete axios.defaults.headers.common['Authorization']
      commit(AUTH_SIGNOUT)
      resolve()
    })
  },
  [CHANGE_PASSWORD_REQUEST]: ({commit, dispatch}, passwordChanges) => {
    return new Promise((resolve, reject) => {
      commit(CHANGE_PASSWORD_REQUEST)
      const changePasswordEndpoint = 'https://sidik.rumahiot.panjatdigital.com/authorize/password/change'
      const fd = new FormData()
      fd.append('old_password', passwordChanges.oldPassword)
      fd.append('new_password', passwordChanges.newPassword)
      fd.append('new_password_retype', passwordChanges.newPasswordRetype)
      axios.post(changePasswordEndpoint, fd)
        .then(resp => {
          commit(CHANGE_PASSWORD_SUCCESS)
          resolve(resp)
        })
        .catch(err => {
          // No need to dispatch user out ( Will me handled in axios interceptor)
          commit(CHANGE_PASSWORD_ERROR)
          reject(err)
        })
    })
  }
}

const mutations = {
  [AUTH_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [AUTH_SUCCESS]: (state, token) => {
    state.status = 'success'
    state.token = token
  },
  [AUTH_ERROR]: (state) => {
    state.status = 'error'
    state.token = ''
  },
  [AUTH_SIGNOUT]: (state) => {
    state.status = 'success'
    state.token = ''
  },
  [CHANGE_PASSWORD_REQUEST]: (state) => {
    state.changePasswordStatus = 'loading'
  },
  [CHANGE_PASSWORD_SUCCESS]: (state) => {
    state.changePasswordStatus = 'success'
  },
  [CHANGE_PASSWORD_ERROR]: (state) => {
    state.changePasswordStatus = 'error'
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
