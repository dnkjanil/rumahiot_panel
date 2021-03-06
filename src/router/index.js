import Vue from 'vue'
import Router from 'vue-router'
import PanelRoot from '@/components/PanelRoot'
import SignIn from '@/components/SignIn'
import AdminSignIn from '@/components/AdminSignIn'
import Register from '@/components/Register'
import ForgotPassword from '@/components/ForgotPassword'
import Profile from '@/components/Profile'
import UserDevices from '@/components/UserDevices'
import Dashboard from '@/components/Dashboard'
import AddUserDevice from '@/components/AddUserDevice'
import AccountLogs from '@/components/AccountLogs'
import DeviceData from '@/components/DeviceData'
import store from '@/store'
import AdminRoot from '@/components/AdminRoot'
import DetailedSupportedBoard from '@/components/DetailedSupportedBoard'
import DetailedSupportedSensor from '@/components/DetailedSupportedSensor'
import UserList from '@/components/UserList'

Vue.use(Router)

// Authenticatiion rules
const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next()
    return
  }
  next('/signin')
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'PanelRoot',
      component: PanelRoot,
      meta: {
        title: 'Rumah IoT',
        metaTags: [
          {
            name: 'description',
            content: 'The home page of our example app.'
          },
          {
            property: 'og:description',
            content: 'The home page of our example app.'
          }
        ]
      },
      children: [
        {
          path: '/devicedata',
          component: DeviceData,
          name: 'DeviceData',
          meta: {
            title: 'Rumah IoT - Device Data',
            metaTags: [
              {
                name: 'description',
                content: 'The home page of our example app.'
              },
              {
                property: 'og:description',
                content: 'The home page of our example app.'
              }
            ]
          }
        },
        {
          path: '/accountlog',
          component: AccountLogs,
          name: 'AccountLogs',
          meta: {
            title: 'Rumah IoT - Profile',
            metaTags: [
              {
                name: 'description',
                content: 'The home page of our example app.'
              },
              {
                property: 'og:description',
                content: 'The home page of our example app.'
              }
            ]
          }
        },
        {
          path: '/profile',
          component: Profile,
          name: 'Profile',
          meta: {
            title: 'Rumah IoT - Profile',
            metaTags: [
              {
                name: 'description',
                content: 'The home page of our example app.'
              },
              {
                property: 'og:description',
                content: 'The home page of our example app.'
              }
            ]
          }
        },
        {
          path: '/mydevices/add',
          component: AddUserDevice,
          name: 'AddUserDevice',
          meta: {
            title: 'Rumah IoT - Add new device',
            metaTags: [
              {
                name: 'description',
                content: 'The home page of our example app.'
              },
              {
                property: 'og:description',
                content: 'The home page of our example app.'
              }
            ]
          }
        },
        {
          path: '/dashboard',
          component: Dashboard,
          name: 'Dashboard',
          meta: {
            title: 'Rumah IoT - Dashboard',
            metaTags: [
              {
                name: 'description',
                content: 'The home page of our example app.'
              },
              {
                property: 'og:description',
                content: 'The home page of our example app.'
              }
            ]
          }
        },
        {
          path: '/mydevices',
          component: UserDevices,
          name: 'UserDevices',
          meta: {
            title: 'Rumah IoT - My Devices',
            metaTags: [
              {
                name: 'description',
                content: 'The home page of our example app.'
              },
              {
                property: 'og:description',
                content: 'The home page of our example app.'
              }
            ]
          }
        }
      ],
      beforeEnter: ifAuthenticated
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: SignIn,
      meta: {
        title: 'Rumah IoT - Sign In',
        metaTags: [
          {
            name: 'description',
            content: 'The home page of our example app.'
          },
          {
            property: 'og:description',
            content: 'The home page of our example app.'
          }
        ]
      },
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {
        title: 'Rumah IoT - Register',
        metaTags: [
          {
            name: 'description',
            content: 'The home page of our example app.'
          },
          {
            property: 'og:description',
            content: 'The home page of our example app.'
          }
        ]
      },
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/forgotpassword',
      name: 'ForgotPassword',
      component: ForgotPassword,
      meta: {
        title: 'Rumah IoT - Forgot Password',
        metaTags: [
          {
            name: 'description',
            content: 'The home page of our example app.'
          },
          {
            property: 'og:description',
            content: 'The home page of our example app.'
          }
        ]
      },
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/admin/signin',
      name: 'AdminSignIn',
      component: AdminSignIn,
      meta: {
        title: 'Rumah IoT - Admin Sign In',
        metaTags: [
          {
            name: 'description',
            content: 'The home page of our example app.'
          },
          {
            property: 'og:description',
            content: 'The home page of our example app.'
          }
        ]
      },
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/admin',
      name: 'AdminRoot',
      component: AdminRoot,
      meta: {
        title: 'Rumah IoT',
        metaTags: [
          {
            name: 'description',
            content: 'The home page of our example app.'
          },
          {
            property: 'og:description',
            content: 'The home page of our example app.'
          }
        ]
      },
      children: [
        {
          path: '/admin/supported/board',
          component: DetailedSupportedBoard,
          name: 'DetailedSupportedBoard',
          meta: {
            title: 'Rumah IoT - Supported Board',
            metaTags: [
              {
                name: 'description',
                content: 'The home page of our example app.'
              },
              {
                property: 'og:description',
                content: 'The home page of our example app.'
              }
            ]
          }
        },
        {
          path: '/admin/supported/sensor',
          component: DetailedSupportedSensor,
          name: 'DetailedSupportedSensor',
          meta: {
            title: 'Rumah IoT - Supported Sensor',
            metaTags: [
              {
                name: 'description',
                content: 'The home page of our example app.'
              },
              {
                property: 'og:description',
                content: 'The home page of our example app.'
              }
            ]
          }
        },
        {
          path: '/admin/user/list',
          component: UserList,
          name: 'UserList',
          meta: {
            title: 'Rumah IoT - Registered User',
            metaTags: [
              {
                name: 'description',
                content: 'The home page of our example app.'
              },
              {
                property: 'og:description',
                content: 'The home page of our example app.'
              }
            ]
          }
        }
      ],
      beforeEnter: ifAuthenticated
    }
  ]
})
