import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UsersService } from '../users/users.service';
import { EventsService } from '../events/events.service';
import { TaskEventsGateway } from '../events/task-events.gateway';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepo: Repository<Task>,
    private readonly usersService: UsersService,
    private readonly eventsService: EventsService,
    private readonly taskGateway: TaskEventsGateway,
  ) {}

  async create(dto: CreateTaskDto, actorUserId?: string): Promise<Task> {
    const task = this.tasksRepo.create({ title: dto.title, description: dto.description, status: dto.status });
    if (dto.assignedToUserId) {
      const user = await this.usersService.findById(dto.assignedToUserId);
      task.assignedTo = user;
    }
    const saved = await this.tasksRepo.save(task);
    this.taskGateway.emitTaskCreated(saved);
    if (actorUserId) {
      await this.eventsService.log({ eventType: 'task.created', taskId: saved.id, userId: actorUserId });
    }
    return saved;
  }

  async findAll(): Promise<Task[]> {
    return this.tasksRepo.find({ relations: ['assignedTo'] });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepo.findOne({ where: { id }, relations: ['assignedTo'] });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, dto: UpdateTaskDto, actorUserId?: string): Promise<Task> {
    const task = await this.findOne(id);
    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    if (dto.status !== undefined) task.status = dto.status;
    const saved = await this.tasksRepo.save(task);
    this.taskGateway.emitTaskUpdated(saved);
    if (actorUserId) {
      await this.eventsService.log({ eventType: 'task.updated', taskId: saved.id, userId: actorUserId });
    }
    return saved;
  }

  async remove(id: string, actorUserId?: string): Promise<void> {
    const task = await this.findOne(id);
    await this.tasksRepo.remove(task);
    if (actorUserId) {
      await this.eventsService.log({ eventType: 'task.deleted', taskId: id, userId: actorUserId });
    }
  }

  async assign(id: string, userId: string, actorUserId?: string): Promise<Task> {
    const [task, user] = await Promise.all([this.findOne(id), this.usersService.findById(userId)]);
    task.assignedTo = user;
    const saved = await this.tasksRepo.save(task);
    this.taskGateway.emitTaskAssigned({ task: saved, userId });
    if (actorUserId) {
      await this.eventsService.log({ eventType: 'task.assigned', taskId: saved.id, userId: actorUserId });
    }
    return saved;
  }
}

