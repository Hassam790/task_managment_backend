import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

const corsOrigin = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

@WebSocketGateway({ cors: { origin: corsOrigin, credentials: true } })
export class TaskEventsGateway {
  @WebSocketServer()
  server!: Server;

  emitTaskCreated(task: any) {
    this.server.emit('task.created', task);
  }

  emitTaskUpdated(task: any) {
    this.server.emit('task.updated', task);
  }

  emitTaskAssigned(payload: { task: any; userId: string }) {
    this.server.emit('task.assigned', payload);
  }
}

