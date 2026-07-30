const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  selectFile: () => ipcRenderer.invoke("select-file"),
  selectOutputDir: () => ipcRenderer.invoke("select-output-dir"),
  convert: (data) => ipcRenderer.invoke("convert", data),
  saveToFolder: (data) => ipcRenderer.invoke("save-to-folder", data)
});
