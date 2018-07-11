import Store from 'electron-store'
import defaults from './defaults'

export default new Store({
  defaults,
  name: 'AppConfig'
})
