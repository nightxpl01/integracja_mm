const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  notifyLoginSuccess: (token) => ipcRenderer.send('login-success', token),
  onToken: (callback) => ipcRenderer.on('auth-token', (_, token) => callback(token))
});
