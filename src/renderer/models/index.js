import changeCase from 'change-case'

const files = require.context('.', false, /\.js$/)
const models = {}

files.keys().forEach(key => {
  if (key === './index.js') return

  const casedKey = changeCase.dot(
    key.replace(/(\.\/|\.js)/g, '')
  )

  models[casedKey] = files(key).default
})

export default models
