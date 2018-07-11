import fs from 'fs'
import config from '@/storage'
import Storage from 'electron-store'
import { cloneDeep } from 'lodash'

const storage = new Storage({
  defaults: {
    resources: {
      directory: '',
      registry: {}
    }
  },
  name: 'AppState'
})

export default function (store) {
  const dir = storage.get('resources.directory')

  let stats

  if (dir) {
    try {
      stats = fs.statSync(dir)
    } catch (err) { console.log(err) }
  }

  if (stats && stats.isDirectory()) {
    store.commit('SET_RESOURCES_DIRECTORY', dir)
  } else {
    storage.set('resources.directory', '')
    storage.set('resources.registry', {})
  }

  if (config.get('isDatabasePersistent')) {
    store.subscribe(({ type, payload }, state) => {
      if (type === 'ADD_FILE') {
        const entry = storage.get('resources.registry.' + (payload.path).replace(/\./g, '\\.'))

        if (entry && entry.hash === payload.hash) {
          store.commit('EDIT_FILE', { id: payload.id, edits: { consume: entry } })
        }

        return
      }

      if (type === 'EDIT_FILE' && payload.edits.consume && payload.edits.consume.status === 'successful') {
        const file = state.resources.files[payload.id]
        storage.set('resources.registry.' + (file.path).replace(/\./g, '\\.'), cloneDeep(file.consume))

        return
      }

      if (type === 'SET_RESOURCES_DIRECTORY' && payload !== storage.get('resources.directory')) {
        storage.set('resources.directory', payload)
        storage.set('resources.registry', {})
      }
    })
  } else {
    store.subscribe(({ type, payload }, state) => {
      if (type === 'SET_RESOURCES_DIRECTORY' && payload !== storage.get('resources.directory')) {
        storage.set('resources.directory', payload)
      }
    })
  }

  store.subscribe(({ type, payload }, state) => {
    if (type === 'SET_IS_FULL_SCREEN') {
      config.set('isFullScreen', payload)
    }
  })
}
