const files = require.context('.', false, /\.js$/)
const plugins = []

files.keys().forEach(key => {
  if (key === './index.js') return

  plugins.push(
    files(key).default
  )
})

export default plugins
