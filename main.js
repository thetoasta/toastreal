const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const Store = require('electron-store');

const store = new Store();

if (!store.has('pushCount')) {
  store.set('pushCount', 0); // Initialize push count
}

let mainWindow;
let updateWindow;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    maximizable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Preload to enable IPC securely
    },
  });

  mainWindow.loadURL('https://toastreal.xyz');

  setupAutoUpdater(mainWindow); // Setup autoUpdater
}

function createUpdateWindow() {
  updateWindow = new BrowserWindow({
    width: 400,
    height: 300,
    resizable: false,
    frame: false,
    modal: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Preload for IPC
    },
  });

  // Load the local updating screen HTML file
  updateWindow.loadFile('updating.html');

  // Disable interaction with the main window while the update window is open
  mainWindow.setEnabled(false);

  updateWindow.on('closed', () => {
    mainWindow.setEnabled(true); // Re-enable the main window when update window is closed
    updateWindow = null;
  });
}

function handlePushAction() {
  const currentCount = store.get('pushCount') || 0;
  store.set('pushCount', currentCount + 1);

  console.log(`Push count: ${currentCount + 1}`);

  if (currentCount + 1 >= 4) {
    store.set('pushCount', 0);
    console.log('Push count reached 4. Checking for updates...');
    autoUpdater.checkForUpdatesAndNotify();
  }
}

// Set up auto-updater events
function setupAutoUpdater(mainWindow) {
  autoUpdater.on('update-available', () => {
    console.log('Update available. Downloading...');
    mainWindow.webContents.send('update-message', 'Update available. Downloading...');
    if (!updateWindow) {
      createUpdateWindow(); // Show updating screen when an update is available
    }
  });

  autoUpdater.on('download-progress', (progress) => {
    console.log(`Download progress: ${Math.round(progress.percent)}%`);
    updateWindow?.webContents.send('update-progress', Math.round(progress.percent));
  });

  autoUpdater.on('update-downloaded', () => {
    console.log('Update downloaded. Restarting now...');
    updateWindow?.webContents.send('update-message', 'Update downloaded. Restarting...');
    setTimeout(() => {
      autoUpdater.quitAndInstall();
    }, 2000);
  });

  autoUpdater.on('error', (error) => {
    console.error('Error during update:', error);
    mainWindow.webContents.send('update-message', 'Error during update.');
    updateWindow?.webContents.send('update-message', 'Error during update. Please try again.');
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  setInterval(() => {
    handlePushAction();
  }, 10000); // Simulate pushes every 10 seconds
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});