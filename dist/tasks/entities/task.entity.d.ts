import { User } from '../../users/entities/user.entity';
export declare enum TaskStatus {
    Todo = "Todo",
    InProgress = "InProgress",
    Done = "Done"
}
export declare class Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    assignedTo?: User | null;
    createdAt: Date;
    updatedAt: Date;
}
