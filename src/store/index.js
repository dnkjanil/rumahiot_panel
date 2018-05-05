import Vue from 'vue'
import Vuex from 'vuex'
import sidik from '@/store/modules/sidik'
import lemari from '@/store/modules/lemari'
import gudang from '@/store/modules/gudang'
import surat from '@/store/modules/surat'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    sidik,
    lemari,
    gudang,
    surat
  },
  strict: debug
})
