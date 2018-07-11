import nodepath from 'path'
import chokidar from 'chokidar'

const WATCH_OPTIONS = {
  persistent: true,
  ignored: /^\./,
  depth: 0,
  awaitWriteFinish: true,
  ignorePermissionErrors: true,
  atomic: true
}

let watcher = null

function watch (directory, store) {
  const glob = '*.csv'

  watcher = chokidar.watch(glob, Object.assign({ cwd: directory }, WATCH_OPTIONS))

  watcher.on('add', path => {
    path = nodepath.join(directory, path)
    updateFiles(path, store)
  })

  watcher.on('change', path => {
    path = nodepath.join(directory, path)
    updateFiles(path, store)
  })

  watcher.on('unlink', path => {
    path = nodepath.join(directory, path)
    removeFile(path, store)
  })
}

function updateFiles (path, store) {
  const file = store.getters.fileList.find(e => e.path === path)

  if (file) {
    store.dispatch('refreshFileHash', file)
  } else {
    store.dispatch('createFile', path)
  }
}

function removeFile (path, store) {
  const file = store.getters.fileList.find(e => e.path === path)

  if (file) {
    store.commit('REMOVE_FILE', file.id)
  }
}

export default function (store) {
  if (store.state.resources.directory) {
    watch(store.state.resources.directory, store)
  }

  store.subscribe(({ type, payload }, state) => {
    if (type !== 'SET_RESOURCES_DIRECTORY') return

    store.commit('CLEAR_FILES')

    if (watcher) {
      watcher.close()
      watcher = null
    }

    if (payload) {
      watch(payload, store)
    }
  })
}
