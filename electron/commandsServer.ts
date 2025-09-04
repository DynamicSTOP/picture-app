import express, { Express } from 'express';
import http from 'http';

let app: Express;

export const startExpressApp = async ({ port = 4501 }: {
  port: number
}): Promise<Express> => {
  if (app) {
    return app;
  }
  app = express();
  const httpServer = http.createServer(app);

  await new Promise<void>((resolve, reject) => {
    const failedTimeout = setTimeout(() => {
      console.log('failed to start express server in 10s')
      reject()
    }, 10000)

    httpServer.listen(port, () => {
      clearTimeout(failedTimeout);
      console.log(`express HTTP Server running on port ${port}`);
      resolve();
    });
  })

  app.get('/', (req, res) => {
    res.json({ message: 'Express is running!', status: 'OK' });
  });

  return app;
}


