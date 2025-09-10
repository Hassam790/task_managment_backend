import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventLog } from './entities/event-log.entity';
import { EventsService } from './events.service';
import { TaskEventsGateway } from './task-events.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([EventLog])],
  providers: [EventsService, TaskEventsGateway],
  exports: [EventsService, TaskEventsGateway, TypeOrmModule],
})
export class EventsModule {}

