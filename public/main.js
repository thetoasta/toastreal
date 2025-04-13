const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize; // Get screen dimensions

  const mainWindow = new BrowserWindow({
    width: width,  // Full width of the screen
    height: height,  // Full height of the screen
    maximizable: true,  // Allow maximizing the window
    webPreferences: {
      nodeIntegration: false, // Disable Node.js integration in the renderer process for security
    },
  });

  mainWindow.loadURL('https://toastreal.xyz');  // Replace with your website's URL
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
