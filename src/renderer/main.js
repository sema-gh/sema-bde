import Vue from 'vue'
import ElementUI from 'element-ui'

// eslint-disable-next-line no-unused-vars
import moment from 'moment'
import 'twix'

import 'amcharts3'
import 'amcharts3/amcharts/serial'
import 'amcharts3/amcharts/lang/de'

import App from './app'
import router from './router'
import store from './store'
import i18n from './i18n'

window.AmCharts_path = 'static/amcharts'

const zoomOutTexts = {}

const beforePrint = () => {
  for (let i = 0; i < window.AmCharts.charts.length; i++) {
    const chart = window.AmCharts.charts[i]

    zoomOutTexts[i] = chart.zoomOutText
    chart.zoomOutText = ''

    chart.validateNow()
  }
}

const afterPrint = () => {
  for (let i = 0; i < window.AmCharts.charts.length; i++) {
    const chart = window.AmCharts.charts[i]

    chart.zoomOutText = zoomOutTexts[i]
    chart.validateNow()
  }
}

if (window.matchMedia) {
  const mediaQueryList = window.matchMedia('print')

  mediaQueryList.addListener(mql => {
    if (mql.matches) {
      beforePrint()
    } else {
      afterPrint()
    }
  })
}

window.onbeforeprint = beforePrint
window.onafterprint = afterPrint

if (!process.env.IS_WEB) {
  Vue.use(require('vue-electron'))
}

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  i18n,
  template: '<App/>'
}).$mount('#app')
