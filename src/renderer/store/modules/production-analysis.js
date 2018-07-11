const state = {
  dateRange: null,
  group: 'days',

  readyType: 'ready.time',

  chartType: 'line',

  zoomRange: null,

  chartConfig: {}
}

const mutations = {
  SET_PRODUCTION_ANALYSIS_DATE_RANGE (state, dateRange) {
    state.dateRange = dateRange
  },

  SET_PRODUCTION_ANALYSIS_GROUP (state, group) {
    state.group = group
  },

  SET_PRODUCTION_ANALYSIS_READY_TYPE (state, readyType) {
    state.readyType = readyType
  },

  SET_PRODUCTION_ANALYSIS_CHART_TYPE (state, chartType) {
    state.chartType = chartType
  },

  SET_PRODUCTION_ANALYSIS_ZOOM_RANGE (state, zoomRange) {
    state.zoomRange = zoomRange
  },

  RECEIVE_PRODUCTION_ANALYSIS_CHART_CONFIG (state, chartConfig) {
    state.chartConfig = chartConfig
  }
}

const actions = {}

const getters = {}

export default {
  state,
  mutations,
  actions,
  getters
}
