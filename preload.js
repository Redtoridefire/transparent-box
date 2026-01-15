const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  toggleFrame: () => ipcRenderer.invoke("toggle-frame"),
  getFrameState: () => ipcRenderer.invoke("get-frame-state")
});
