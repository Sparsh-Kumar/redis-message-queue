import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import morgan from 'morgan';
import AbstractApplication from './helpers/AbstractApplication';

export default class App extends AbstractApplication {
  public setup(): void {
    this.app = express();
    this.app.use(morgan(this.options.morganConfig.format));
    const port = process.env.PORT || 8000;

    /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
    const httpServer = http.createServer(this.app);
    const wss = new WebSocketServer({ server: httpServer });

    wss.on('connection', (ws) => {
      ws.on('close', () => {
        console.log('Connection closed.');
      });
    });

    httpServer.listen(port, () => {
      console.log(`Server is listening on port: ${port}`);
    });
  }
}
