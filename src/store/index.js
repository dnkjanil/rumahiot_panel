import Vue from 'vue'
import Vuex from 'vuex'
import sidik from '@/store/modules/sidik'
import lemari from '@/store/modules/lemari'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    sidik,
    lemari
  },
  strict: debug
})
