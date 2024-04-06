import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { addUser, verifyUser } from '../backend/local/database'
import generatePassword from "../backend/utils/passwordGenerator"

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    minWidth: 900,
    minHeight: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC handlers

  ipcMain.handle('register-account', (event, args) => {
    return new Promise((resolve) => {
      const { userName, masterKey, firstName, lastName } = args
      console.log(userName, masterKey, firstName, lastName)
      addUser(userName, masterKey, firstName, lastName)
        .then((response) => {
          if(response.success){
            resolve({ success: true, message: 'Account registration success' })
          }else{
            resolve({ success: false, message: response.message })
          }
        })
        .catch((error) => {
          console.error('Registration error:', error)
          resolve({ success: false, message: 'Internal Server Error.' })
        })
    })
  })

  ipcMain.handle('generate-password', ()=>{
    return new Promise((resolve, reject)=>{
      const generatedPassword = generatePassword()
      if(generatePassword){
        resolve(generatedPassword)
      }else{
        reject("Password generation error")
      }
    })
  })

  ipcMain.handle('login-user', (event, args) => {
    return new Promise((resolve) => {
      const { userName, masterKey } = args
      if(!userName || userName.length < 1){
        resolve({success:false, message:"no username provided"})
      }
      if(!masterKey || masterKey.length < 1){
        resolve({success:false, message:"no master key provided"})
      }
      verifyUser(userName, masterKey)
        .then((response)=>{
          if(response.success){
            resolve({success:true, message: "user authentication success"})
          }else{
            resolve({success:false, message:"user authentication failed"})
          }
        })
        .catch((err)=>{
          console.log("Login error: ", err)
          resolve({success:false, message:"internal server error"})
        })
    })
  })


  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
