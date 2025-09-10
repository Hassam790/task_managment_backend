import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UsersService } from '../users/users.service';
import { EventsService } from '../events/events.service';
import { TaskEventsGateway } from '../events/task-events.gateway';
export declare class TasksService {
    private readonly tasksRepo;
    private readonly usersService;
    private readonly eventsService;
    private readonly taskGateway;
    constructor(tasksRepo: Repository<Task>, usersService: UsersService, eventsService: EventsService, taskGateway: TaskEventsGateway);
    create(dto: CreateTaskDto, actorUserId?: string): Promise<Task>;
    findAll(): Promise<Task[]>;
    findOne(id: string): Promise<Task>;
    update(id: string, dto: UpdateTaskDto, actorUserId?: string): Promise<Task>;
    remove(id: string, actorUserId?: string): Promise<void>;
    assign(id: string, userId: string, actorUserId?: string): Promise<Task>;
}
