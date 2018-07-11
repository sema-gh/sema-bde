import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'
import plugins from './plugins'

Vue.use(Vuex)

const state = {
  locale: 'de',

  isFullScreen: false,
  isMaximized: false,

  isSidebarVisible: false
}

const mutations = {
  SET_LOCALE (state, locale) {
    state.locale = locale
  },

  SET_IS_FULL_SCREEN (state, isFullScreen) {
    state.isFullScreen = isFullScreen
  },

  SET_IS_MAXIMIZED (state, isMaximized) {
    state.isMaximized = isMaximized
  },

  SET_IS_SIDEBAR_VISIBLE (state, isSidebarVisible) {
    state.isSidebarVisible = isSidebarVisible
  }
}

const actions = {
  load ({ commit }, storage) {
    commit('SET_IS_DATABASE_PERSISTENT', storage.isDatabasePersistent)
    commit('SET_IS_AUTO_CONSUME_ENABLED', storage.isAutoImportEnabled)

    commit('RECEIVE_CONFIGS', storage.importConfigs)
    commit('RECEIVE_MALFUNCTION_ANALYSIS_CHART_CONFIG', storage.faultSignalsChartConfig)
    commit('RECEIVE_PRODUCTION_ANALYSIS_CHART_CONFIG', storage.readySignalsChartConfig)
  }
}

const getters = {}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules,
  plugins,
  strict: process.env.NODE_ENV !== 'production'
})
