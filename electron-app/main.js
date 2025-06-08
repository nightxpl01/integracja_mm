const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let authWindow;
let mainWindow;

function createAuthWindow() {
  authWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  authWindow.loadFile('auth.html');
}

function createMainWindow(token) {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile('main.html');
  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.webContents.send('auth-token', token);
  });

  if (authWindow) {
    authWindow.close();
    authWindow = null;
  }
}

app.whenReady().then(() => {
  createAuthWindow();

  ipcMain.on('login-success', (_, token) => {
    createMainWindow(token);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createAuthWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
