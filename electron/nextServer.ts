import { ChildProcess, spawn } from 'node:child_process';

import * as http from 'http';
import * as path from 'path';
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let nextProcess: ChildProcess;

export const startNextServer = async (port = 4500): Promise<ChildProcess> => new Promise((resolve) => {
  console.log('Starting nextjs server on port', port);
  nextProcess = spawn('next', ['dev', '--turbopack', '-p', port.toString(10)], {
    cwd: path.join(__dirname, '..'),
    shell: true,
    stdio: 'inherit',
  });
  nextProcess.on('error', (error: unknown) => console.log('%cspawn:error', error, 'color: red;'));

  const checkServer = () => {
    console.log('checking server');
    http.get(`http://localhost:${port.toString(10)}`, (res) => {
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
