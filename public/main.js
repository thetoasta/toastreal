const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // Disable Node.js integration in the renderer process for security
    },
  })

  mainWindow.loadURL('https://toastreal.xyz')  // Replace with your website's URL
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

