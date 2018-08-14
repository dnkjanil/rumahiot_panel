import {
  ADMIN_AUTH_REQUEST,
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_SIGNOUT,
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_ERROR,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_ERROR,
  ACTIVATE_ACCOUNT_REQUEST,
  ACTIVATE_ACCOUNT_SUCCESS,
  ACTIVATE_ACCOUNT_ERROR,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_ERROR,
  FORGOT_PASSWORD_CONFIRMATION_REQUEST,
  FORGOT_PASSWORD_CONFIRMATION_SUCCESS,
  FORGOT_PASSWORD_CONFIRMATION_ERROR,
  GET_USER_LIST_REQUEST,
  GET_USER_LIST_SUCCESS,
  GET_USER_LIST_ERROR,
  UPDATE_USER_DETAIL_REQUEST,
  UPDATE_USER_DETAIL_SUCCESS,
  UPDATE_USER_DETAIL_ERROR
}
  from '../actions/sidik'

import axios from 'axios'

const state = {
  token: localStorage.getItem('rumahiot-token') || '',
  changePasswordStatus: '',
  status: '',
  userList: {}
}

const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status,
  getUserList: state => state.userList
}

const actions = {
  [UPDATE_USER_DETAIL_REQUEST]: ({commit, dispatch}, userDetail) => {
    return new Promise((resolve, reject) => {
      commit(UPDATE_USER_DETAIL_REQUEST)
      const updateUserDetailEndpoint = 'https://sidik.rumahiot.panjatdigital.com/authenticate/user/update'
      const fd = new FormData()
      fd.append('user_uuid', userDetail.user_uuid)
      fd.append('activated', userDetail.activated)
      fd.append('admin', userDetail.admin)
      axios.post(updateUserDetailEndpoint, fd)
        .then(resp => {
          commit(UPDATE_USER_DETAIL_SUCCESS)
          resolve(resp)
        })
        .catch(err => {
          commit(UPDATE_USER_DETAIL_ERROR)
          reject(err)
        })
    })
  },
  [GET_USER_LIST_REQUEST]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      commit(GET_USER_LIST_REQUEST)
      const getUserListEndpoint = 'https://sidik.rumahiot.panjatdigital.com/authenticate/user/list'
      axios.get(getUserListEndpoint)
        .then(resp => {
          commit(GET_USER_LIST_SUCCESS, resp.data.data)
          resolve(resp)
        })
        .catch(err => {
          commit(GET_USER_LIST_ERROR)
          reject(err)
        })
    })
  },
  [FORGOT_PASSWORD_CONFIRMATION_REQUEST]: ({commit, dispatch}, data) => {
    return new Promise((resolve, reject) => {
      commit(FORGOT_PASSWORD_CONFIRMATION_REQUEST)
      const forgotPasswordConfirmationRequestEndpoint = 'https://sidik.rumahiot.panjatdigital.com/authorize/password/forgot/confirm/'
      const fd = new FormData()
      fd.append('new_password', data.newPassword)
      fd.append('new_password_retype', data.newPasswordRetype)
      fd.append('forgot_password_uuid', data.forgotPasswordUUID)
      axios.post(forgotPasswordConfirmationRequestEndpoint, fd)
        .then(resp => {
          commit(FORGOT_PASSWORD_CONFIRMATION_SUCCESS)
          resolve(resp)
        })
        .catch(err => {
          commit(FORGOT_PASSWORD_CONFIRMATION_ERROR)
          reject(err)
        })
    })
  },
  [FORGOT_PASSWORD_REQUEST]: ({commit, dispatch}, data) => {
    return new Promise((resolve, reject) => {
      commit(FORGOT_PASSWORD_REQUEST)
      const forgotPasswordRequestEndpoint = 'https://sidik.rumahiot.panjatdigital.com/authorize/password/forgot'
      const fd = new FormData()
      fd.append('email', data.email)
      fd.append('g-recaptcha-response', data.recaptchaResponse)
      axios.post(forgotPasswordRequestEndpoint, fd)
        .then(resp => {
          commit(FORGOT_PASSWORD_SUCCESS, resp.data.data)
          resolve(resp)
        })
        .catch(err => {
          commit(FORGOT_PASSWORD_ERROR)
          reject(err)
        })
    })
  },
  [ACTIVATE_ACCOUNT_REQUEST]: ({commit, dispatch}, activationUUID) => {
    return new Promise((resolve, reject) => {
      commit(ACTIVATE_ACCOUNT_REQUEST)
      const accountActivationEndpoint = 'https://sidik.rumahiot.panjatdigital.com/authorize/email/activate/' + activationUUID
      axios.get(accountActivationEndpoint)
        .then(resp => {
          commit(ACTIVATE_ACCOUNT_SUCCESS)
          resolve(resp)
        })
        .catch(err => {
          commit(ACTIVATE_ACCOUNT_ERROR)
          reject(err)
        })
    })
  },
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
  [ADMIN_AUTH_REQUEST]: ({commit, dispatch}, user) => {
    return new Promise((resolve, reject) => {
      commit(ADMIN_AUTH_REQUEST)
      const adminEmailAuthenticationEndpoint = 'https://sidik.rumahiot.panjatdigital.com/authenticate/admin/email'
      const fd = new FormData()
      fd.append('email', user.email)
      fd.append('password', user.password)
      axios.post(adminEmailAuthenticationEndpoint, fd)
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
  [ADMIN_AUTH_REQUEST]: (state) => {
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
  },
  [REGISTER_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [REGISTER_SUCCESS]: (state) => {
    state.status = 'success'
  },
  [REGISTER_ERROR]: (state) => {
    state.status = 'error'
  },
  [ACTIVATE_ACCOUNT_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [ACTIVATE_ACCOUNT_SUCCESS]: (state) => {
    state.status = 'success'
  },
  [ACTIVATE_ACCOUNT_ERROR]: (state) => {
    state.status = 'error'
  },
  [FORGOT_PASSWORD_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [FORGOT_PASSWORD_SUCCESS]: (state) => {
    state.status = 'success'
  },
  [FORGOT_PASSWORD_ERROR]: (state) => {
    state.status = 'error'
  },
  [FORGOT_PASSWORD_CONFIRMATION_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [FORGOT_PASSWORD_CONFIRMATION_SUCCESS]: (state) => {
    state.status = 'success'
  },
  [FORGOT_PASSWORD_CONFIRMATION_ERROR]: (state) => {
    state.status = 'error'
  },
  [GET_USER_LIST_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [GET_USER_LIST_SUCCESS]: (state, userList) => {
    state.userList = userList
    state.status = 'success'
  },
  [GET_USER_LIST_ERROR]: (state) => {
    state.status = 'error'
  },
  [UPDATE_USER_DETAIL_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [UPDATE_USER_DETAIL_SUCCESS]: (state) => {
    state.status = 'success'
  },
  [UPDATE_USER_DETAIL_ERROR]: (state) => {
    state.status = 'error'
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
