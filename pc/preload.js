const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("NativeStore", {
  status: () => ipcRenderer.invoke("store:status"),
  choose: () => ipcRenderer.invoke("store:choose"),
  confirm: (folder) => ipcRenderer.invoke("store:confirm", folder),
  load: () => ipcRenderer.invoke("store:load"),
  save: (text) => ipcRenderer.invoke("store:save", text),
  saveFile: (sub, name, b64) => ipcRenderer.invoke("store:saveFile", sub, name, b64),
  reveal: (p) => ipcRenderer.invoke("store:reveal", p)
});
