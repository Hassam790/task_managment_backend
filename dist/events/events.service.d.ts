import { Repository } from 'typeorm';
import { EventLog } from './entities/event-log.entity';
export declare class EventsService {
    private readonly eventLogsRepo;
    constructor(eventLogsRepo: Repository<EventLog>);
    log(event: {
        eventType: string;
        taskId: string;
        userId: string;
    }): Promise<void>;
}
