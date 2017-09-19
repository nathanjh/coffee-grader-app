import Vue from 'vue'
import Vuex from 'vuex'
import sessions from './modules/sessions'
import plugins from './plugins'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    sessions
  },
  plugins
})
