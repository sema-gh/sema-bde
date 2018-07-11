'use strict'

import Store from 'electron-store'
import { debounce } from 'lodash'
import { app, BrowserWindow } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let win

const state = new Store({
  name: 'AppWindow',
  defaults: {
    bounds: {
      width: 1280,
      height: 720
    },
    isMaximized: true
  }
})

const debouncedSaveBounds = debounce(() => {
  if (win) {
    state.set('bounds', win.getBounds())
  }
}, 100)

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  win = new BrowserWindow({
    show: false,
    frame: true,
    resizable: true,
    ...state.get('bounds')
  })

  const shouldQuit = app.makeSingleInstance(() => {
    if (win) {
      if (win.isMinimized()) {
        win.restore()
      }

      win.focus()
    }

    return true
  })

  if (shouldQuit) {
    app.quit()
    return
  }

  if (process.env.NODE_ENV !== 'development') {
    win.setMenu(null)
  }

  win.loadURL(winURL)

  win.on('enter-full-screen', () => win.webContents.send('window-event', 'enter-full-screen'))
  win.on('leave-full-screen', () => win.webContents.send('window-event', 'leave-full-screen'))

  win.on('maximize', () => {
    state.set('isMaximized', true)
    win.webContents.send('window-event', 'maximize')
  })

  win.on('unmaximize', () => {
    state.set('isMaximized', false)
    win.webContents.send('window-event', 'unmaximize')
  })

  win.on('minimize', () => win.webContents.send('window-event', 'minimize'))

  win.on('resize', debouncedSaveBounds)
  win.on('move', debouncedSaveBounds)

  win.once('ready-to-show', () => {
    if (state.get('isMaximized')) {
      win.maximize()
    }

    win.show()
  })

  win.on('closed', () => { win = null })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
