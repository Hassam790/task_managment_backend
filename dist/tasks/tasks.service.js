"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_entity_1 = require("./entities/task.entity");
const users_service_1 = require("../users/users.service");
const events_service_1 = require("../events/events.service");
const task_events_gateway_1 = require("../events/task-events.gateway");
let TasksService = class TasksService {
    constructor(tasksRepo, usersService, eventsService, taskGateway) {
        this.tasksRepo = tasksRepo;
        this.usersService = usersService;
        this.eventsService = eventsService;
        this.taskGateway = taskGateway;
    }
    async create(dto, actorUserId) {
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
    async findAll() {
        return this.tasksRepo.find({ relations: ['assignedTo'] });
    }
    async findOne(id) {
        const task = await this.tasksRepo.findOne({ where: { id }, relations: ['assignedTo'] });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        return task;
    }
    async update(id, dto, actorUserId) {
        const task = await this.findOne(id);
        if (dto.title !== undefined)
            task.title = dto.title;
        if (dto.description !== undefined)
            task.description = dto.description;
        if (dto.status !== undefined)
            task.status = dto.status;
        const saved = await this.tasksRepo.save(task);
        this.taskGateway.emitTaskUpdated(saved);
        if (actorUserId) {
            await this.eventsService.log({ eventType: 'task.updated', taskId: saved.id, userId: actorUserId });
        }
        return saved;
    }
    async remove(id, actorUserId) {
        const task = await this.findOne(id);
        await this.tasksRepo.remove(task);
        if (actorUserId) {
            await this.eventsService.log({ eventType: 'task.deleted', taskId: id, userId: actorUserId });
        }
    }
    async assign(id, userId, actorUserId) {
        const [task, user] = await Promise.all([this.findOne(id), this.usersService.findById(userId)]);
        task.assignedTo = user;
        const saved = await this.tasksRepo.save(task);
        this.taskGateway.emitTaskAssigned({ task: saved, userId });
        if (actorUserId) {
            await this.eventsService.log({ eventType: 'task.assigned', taskId: saved.id, userId: actorUserId });
        }
        return saved;
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        events_service_1.EventsService,
        task_events_gateway_1.TaskEventsGateway])
], TasksService);
//# sourceMappingURL=tasks.service.js.map