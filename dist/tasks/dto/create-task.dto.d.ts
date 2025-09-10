import { TaskStatus } from '../entities/task.entity';
export declare class CreateTaskDto {
    title: string;
    description?: string;
    status?: TaskStatus;
    assignedToUserId?: string;
}
