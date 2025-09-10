"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const event_log_entity_1 = require("./entities/event-log.entity");
const events_service_1 = require("./events.service");
const task_events_gateway_1 = require("./task-events.gateway");
let EventsModule = class EventsModule {
};
exports.EventsModule = EventsModule;
exports.EventsModule = EventsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([event_log_entity_1.EventLog])],
        providers: [events_service_1.EventsService, task_events_gateway_1.TaskEventsGateway],
        exports: [events_service_1.EventsService, task_events_gateway_1.TaskEventsGateway, typeorm_1.TypeOrmModule],
    })
], EventsModule);
//# sourceMappingURL=events.module.js.map