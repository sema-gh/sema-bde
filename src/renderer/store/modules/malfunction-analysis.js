const state = {
  dateRange: null,
  group: 'days',

  faultType: 'fault.count',

  chartType: 'line',

  zoomRange: null,

  chartConfig: {}
}

const mutations = {
  SET_MALFUNCTION_ANALYSIS_DATE_RANGE (state, dateRange) {
    state.dateRange = dateRange
  },

  SET_MALFUNCTION_ANALYSIS_GROUP (state, group) {
    state.group = group
  },

  SET_MALFUNCTION_ANALYSIS_FAULT_TYPE (state, faultType) {
    state.faultType = faultType
  },

  SET_MALFUNCTION_ANALYSIS_CHART_TYPE (state, chartType) {
    state.chartType = chartType
  },

  SET_MALFUNCTION_ANALYSIS_ZOOM_RANGE (state, zoomRange) {
    state.zoomRange = zoomRange
  },

  RECEIVE_MALFUNCTION_ANALYSIS_CHART_CONFIG (state, chartConfig) {
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
