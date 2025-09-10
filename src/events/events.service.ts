import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventLog } from './entities/event-log.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventLog)
    private readonly eventLogsRepo: Repository<EventLog>,
  ) {}

  async log(event: { eventType: string; taskId: string; userId: string }): Promise<void> {
    const row = this.eventLogsRepo.create(event);
    await this.eventLogsRepo.save(row);
  }
}

