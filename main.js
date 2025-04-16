const { app, BrowserWindow, autoUpdater } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

// Log updater behavior (optional)
autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';
autoUpdater.autoDownload = true;

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL('https://toastreal.xyz');

  setupAutoUpdater();
}

function setupAutoUpdater() {
  // Check for updates when app is ready
  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for updates...');
  });

  autoUpdater.on('update-available', (info) => {
    console.log('Update available:', info);
    if (mainWindow) {
      mainWindow.webContents.send('update-message', 'Update available. Downloading...');
    }
  });

  autoUpdater.on('update-not-available', () => {
    console.log('No updates available.');
  });

  autoUpdater.on('download-progress', (progressObj) => {
    console.log(`Downloaded ${progressObj.percent}%`);
    if (mainWindow) {
      mainWindow.webContents.send('update-progress', progressObj.percent);
    }
  });

  autoUpdater.on('update-downloaded', () => {
    console.log('Update downloaded. Restarting...');
    autoUpdater.quitAndInstall();
  });

  autoUpdater.on('error', (err) => {
    console.error('Update error:', err);
  });
}

app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});