import { ipcRenderer } from 'electron'

function setIsFullScreen (store, value) {
  if (store.state.isFullScreen !== value) {
    store.commit('SET_IS_FULL_SCREEN', value)
  }
}

function setIsMaximized (store, value) {
  if (store.state.isMaximized !== value) {
    store.commit('SET_IS_MAXIMIZED', value)
  }
}

export default function (store) {
  ipcRenderer.removeAllListeners('window-event')

  ipcRenderer.on('window-event', (event, name) => {
    switch (name) {
      case 'enter-full-screen':
        setIsFullScreen(store, true)
        break
      case 'leave-full-screen':
        setIsFullScreen(store, false)
        break
      case 'maximize':
        setIsMaximized(store, true)
        break
      case 'unmaximize':
        setIsMaximized(store, false)
        break
      case 'minimize':
        setIsMaximized(store, false)
        break
    }
  })
}
