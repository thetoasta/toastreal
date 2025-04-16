const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater'); // Import electron-updater
const path = require('path');

// Electron lifecycle hooks
app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL('https://toastreal.xyz');

  // AutoUpdater Setup
  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('update-available', () => {
    console.log('Update available.');
  });

  autoUpdater.on('update-not-available', () => {
    console.log('No updates available.');
  });

  autoUpdater.on('error', (err) => {
    console.error('Error in auto-updater:', err);
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});