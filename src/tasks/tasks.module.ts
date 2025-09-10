import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { UsersModule } from '../users/users.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), UsersModule, EventsModule],
  providers: [TasksService],
  controllers: [TasksController],
  exports: [TasksService, TypeOrmModule],
})
export class TasksModule {}

