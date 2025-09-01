import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('db', {
  insertNote: (content:string) => ipcRenderer.invoke('db-insert-note', content),
  getNotes: () => ipcRenderer.invoke('db-get-notes'),
});