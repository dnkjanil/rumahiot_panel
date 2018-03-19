import Vue from 'vue'
import Router from 'vue-router'
import PanelRoot from '@/components/PanelRoot'
import SignIn from '@/components/SignIn'
import Profile from '@/components/Profile'
import UserDevices from '@/components/UserDevices'
import store from '@/store'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(Router)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCEtcrfWWhc3uP_sdPNnk-2ZoILF5OP46U ',
    libraries: 'places'
  }
})

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
  routes: [
    {
      path: '/',
      name: 'PanelRoot',
      component: PanelRoot,
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
      },
      children: [
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
    }
  ]
})
