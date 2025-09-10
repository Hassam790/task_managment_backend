import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../common/enums/role.enum';
import { GetUser } from '../common/decorators/get-user.decorator';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@Controller('tasks')
@ApiTags('tasks')
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles(Role.Admin, Role.User)
  create(@Body() dto: CreateTaskDto, @GetUser() user: any) {
    return this.tasksService.create(dto, user?.id);
  }

  @Get()
  @Roles(Role.Admin, Role.User)
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin, Role.User)
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.Admin, Role.User)
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @GetUser() user: any) {
    return this.tasksService.update(id, dto, user?.id);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.tasksService.remove(id, user?.id);
  }

  @Put(':id/assign')
  @Roles(Role.Admin)
  assign(@Param('id') id: string, @Body('userId') userId: string, @GetUser() user: any) {
    return this.tasksService.assign(id, userId, user?.id);
  }
}

