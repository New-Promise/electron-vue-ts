'use strict'

import { app, BrowserWindow, screen, Menu, globalShortcut } from 'electron'
import { Config, readFile } from './config'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  // @ts-ignore
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow:any
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow (conf?: { title: string } ) {
  /**
   * Initial window options
   */
  // 关闭顶部导航菜单栏
  Menu.setApplicationMenu(null)
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const config: object = {
    height,
    useContentSize: true,
    width,
    center: true,
    resizable: true, // 窗口大小是否可改变
    maximizable: true, // 窗口是否可以最大化
    frame: true, // 是否显示顶部导航栏
    title: (conf && conf.title) || '',
    webPreferences: {
      nodeIntegrationInSubFrames: true,
      nodeIntegration: true,
      // 官网似乎说是默认false，但是这里必须设置contextIsolation
      contextIsolation: false,
      enableRemoteModule: true,
      allowRunningInsecureContent: true,
      experimentalFeatures: true,
      webSecurity: false,
      v8CacheOptions: 'none'
    }
  }
  console.log(config)
  mainWindow = new BrowserWindow(config)

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  /* eslint-disable no-new */
  new Config(mainWindow)

  globalShortcut.register('Ctrl+F12', () => { // 打开主程序开发者工具
    mainWindow.openDevTools()
  })
}
function init () {
  //   createWindow()
  readFile().then((res: any) => {
    if (app.isReady()) createWindow(res)
  }).catch(err => {
    console.error(err)
  })
}
app.on('ready', init)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
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
