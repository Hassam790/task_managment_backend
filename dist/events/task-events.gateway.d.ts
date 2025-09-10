import { Server } from 'socket.io';
export declare class TaskEventsGateway {
    server: Server;
    emitTaskCreated(task: any): void;
    emitTaskUpdated(task: any): void;
    emitTaskAssigned(payload: {
        task: any;
        userId: string;
    }): void;
}
