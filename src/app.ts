import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import AbstractApplication from './helpers/AbstractApplication';

export default class App extends AbstractApplication {
  public setup(): void {
    /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
    const httpServer = createServer();
    const port = process.env.PORT || 8000;
    this.socketIO = new Server(httpServer, {
      cors: {
        origin: '*',
      },
    });

    this.socketIO.on('connection', (socket: Socket) => {
      console.log('A client connected:', socket.id);

      socket.on('message', (message: string) => {
        console.log('Received message:', message);
        socket.emit('response', 'Message received!');
      });

      socket.on('disconnect', (reason) => {
        console.log(`Client disconnected (${socket.id}):`, reason);
      });
    });

    httpServer.listen(port, () => {
      console.log(`Server is listening on port: ${port}`);
    });
  }
}
