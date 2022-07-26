import {globalShortcut, ipcMain, app} from 'electron'
const path = require('path')
const fs = require('fs')

const filePath = path.join(app.getPath('documents'), '/webBrowser-electron/config.json')
const dirPath = path.join(app.getPath('documents'), '/webBrowser-electron')
const oldPath = process.env.NODE_ENV !== 'development'
  ? path.join(__dirname, 'static/json/common.json') : path.join(__dirname, '../../../static/json/common.json')
console.log(oldPath)
export function readFile () {
  return new Promise((resolve, reject) => {
    function readConfig (resolve: any, reject: any) {
      fs.readFile(filePath, (err: any, newData: any) => {
        fs.readFile(oldPath, (oldErr: any, oldData: any) => {
          if (err) {
            if (oldErr) reject(oldErr)
            else {
              fs.writeFile(filePath, JSON.stringify(JSON.parse(oldData)), 'utf-8', (writeErr: any) => {
                if (writeErr) reject(writeErr)
                else reject(JSON.parse(oldData))
              })
            }
          } else {
            let jsonData = Object.assign(JSON.parse(oldData), JSON.parse(newData))
            fs.writeFile(filePath, JSON.stringify(jsonData), 'utf-8', (writeErr: any) => {
              if (writeErr) reject(writeErr)
              else resolve(jsonData)
            })
          }
        })
      })
    }
    fs.access(dirPath, (err: any) => {
      if (err) {
        fs.mkdirSync(path.join(app.getPath('documents'), '/webBrowser-electron'))
      }
      readConfig(resolve, reject)
    })
  })
}
export class entrance {
  mainWindow
  constructor (mainWin: any) {
    this.mainWindow = mainWin
    this.globalShortcut()
    this.setData()
    this.getData()
  }
  globalShortcut () {
    globalShortcut.register('Ctrl+Alt+Q', () => {
      readFile().then((data: any) => {
        this.mainWindow.webContents.send('getDataSuccess', data)
      }).catch(err => {
        this.mainWindow.webContents.send('getDataError', `error: ${err}`)
        (global as any).log.error(err.toString())
      })
    })
  }
  setData () {
    ipcMain.on('setData', (event, args) => {
      fs.writeFile(filePath, args, 'utf-8', (writeErr: any) => {
        if (!writeErr) {
          event.sender.send('setDataSuccess', args)
          if (process.env.NODE_ENV !== 'development') {
            app.relaunch()
            app.exit()
          }
        }
      })
    })
  }
  getData () {
    ipcMain.on('getData', (event) => {
      readFile().then(jsonData => {
        event.sender.send('getDataSuccess_', jsonData)
      }).catch(err => {
        // event.sender.send('getDataError', `error: ${err}`)
        (global as any).log.error(err.toString())
      })
    })
  }
}
