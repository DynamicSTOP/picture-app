import { app, BrowserWindow } from 'electron';
import { ChildProcess } from 'node:child_process';
import { startNextServer } from './nextServer.js';
import { startExpressApp } from './commandsServer.js';
import { showLoadingPage } from './loading.html.js';

const NEXT_PORT = 4500
let nextProcess: ChildProcess;

const isDev = process.env.DEV_ENV !== undefined;


const createWindow = async () => {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    show: false
  });
  await showLoadingPage(win);

  win.webContents.on("did-fail-load", (e, code, desc) => {
    console.log('error', code, desc);
    console.log('error', e);
    setTimeout(() => {
      win.webContents.reloadIgnoringCache()
    }, 100);
  });

  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }

  const [app, next] = await Promise.all([startExpressApp({ port: NEXT_PORT + 1 }), startNextServer(NEXT_PORT)]);
  nextProcess = next;
  const devUrl = `http://localhost:${NEXT_PORT}`;
  await win.loadURL(devUrl);
};

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    if (nextProcess) {
      nextProcess.kill('SIGTERM');
    }
    process.exit(0);
  }
});



