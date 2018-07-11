import Vue from 'vue'
import I18n from 'vue-i18n'

import messages from './messages'

Vue.use(I18n)

export default new I18n({
  messages,
  locale: 'de',
  fallbackLocale: 'de'
})
