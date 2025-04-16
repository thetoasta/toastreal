const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater'); // Use electron-updater directly
const path = require('path');
const log = require('electron-log');

// Setup logging
autoUpdater.logger = log;
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
  // Attach autoUpdater triggers
  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('checking-for-update', () => {
    log.info('Checking for updates...');
  });

  autoUpdater.on('update-available', (info) => {
    log.info('Update available:', info);
    if (mainWindow) {
      mainWindow.webContents.send('update-message', 'Update available. Downloading...');
    }
  });

  autoUpdater.on('update-not-available', () => {
    log.info('No updates available.');
  });

  autoUpdater.on('download-progress', (progressObj) => {
    log.info(`Downloaded ${progressObj.percent}%`);
    if (mainWindow) {
      mainWindow.webContents.send('update-progress', progressObj.percent);
    }
  });

  autoUpdater.on('update-downloaded', () => {
    log.info('Update downloaded. Restarting...');
    autoUpdater.quitAndInstall();
  });

  autoUpdater.on('error', (err) => {
    log.error('Update error:', err);
  });
}

// Electron lifecycle hooks
app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});