import { app, BrowserWindow, ipcMain } from 'electron';
import { spawn } from 'node:child_process';
import * as http from 'http';
import * as path from 'path';
import { getAllNotes, insertNote } from './db.js';
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Step 1: Start Next.js dev server
const startNextServer = async () => new Promise((resolve) => {
  console.log('starting nextjs');
  const nextProcess = spawn('npm', ['run', 'next'], {
    cwd: path.join(__dirname, '..'),
    shell: true,
    stdio: 'inherit',
  });
  nextProcess.on('error', (error) => console.log(`spawn:error:${error}`))

  // Step 2: Poll for readiness
  const checkServer = () => {
    console.log('checking server');
    http.get('http://localhost:3000', (res) => {
      if (res.statusCode === 200) {
        resolve(nextProcess); // Server is up
      } else {
        setTimeout(checkServer, 500);
      }
    }).on('error', () => {
      setTimeout(checkServer, 500);
    });
  };

  checkServer();
});


const createWindow = async () => {
  await startNextServer();
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.webContents.on("did-fail-load", (e, code, desc) => {
    win.webContents.reloadIgnoringCache();
  });

  win.webContents.on('devtools-opened', () => {
    console.log('devtools opened');
  })

  win.webContents.on('devtools-closed', () => {
    console.log('devtools closed');
  })
  win.webContents.openDevTools({ mode: 'detach' });
  const devUrl = 'http://localhost:3000';
  await win.loadURL(devUrl);
};

// Handle IPC calls from renderer (Next.js)
ipcMain.handle('db-insert-note', (event, content: string) => {
  return insertNote(content);
});

ipcMain.handle('db-get-notes', () => {
  return getAllNotes();
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});



