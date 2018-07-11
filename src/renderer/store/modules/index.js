import changeCase from 'change-case'

const files = require.context('.', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
  if (key === './index.js') return

  const casedKey = changeCase.camel(
    key.replace(/(\.\/|\.js)/g, '')
  )

  modules[casedKey] = files(key).default
})

export default modules
