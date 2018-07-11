import moment from 'moment'

const BOOLEAN_VALUE_MAP = {
  true: true,
  false: false
}

const NUMBER_SEPARATOR_REGEX = /[,. ]/g
const NUMBER_THOUSANDS_SEP = ''
const NUMBER_DECIMAL_SEP = '.'

export default {
  string (value, options) {
    return value.trim()
  },

  boolean (value, options) {
    return BOOLEAN_VALUE_MAP[value.trim()]
  },

  number (value, { separators } = {}) {
    if (!separators) {
      return +value.trim()
    }

    return +value.trim().replace(NUMBER_SEPARATOR_REGEX, char => {
      if (char === separators.thousands) {
        return NUMBER_THOUSANDS_SEP
      } else if (char === separators.decimal) {
        return NUMBER_DECIMAL_SEP
      }
    })
  },

  datetime (value, { format = undefined } = {}) {
    return moment(value.trim(), format).toISOString()
  }
}
