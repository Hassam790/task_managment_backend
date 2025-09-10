import { Role } from '../../common/enums/role.enum';
import { Task } from '../../tasks/entities/task.entity';
export declare class User {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: Role;
    assignedTasks: Task[];
    createdAt: Date;
    updatedAt: Date;
}
