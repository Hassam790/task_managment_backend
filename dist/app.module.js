"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const users_module_1 = require("./users/users.module");
const tasks_module_1 = require("./tasks/tasks.module");
const events_module_1 = require("./events/events.module");
const auth_module_1 = require("./auth/auth.module");
const baseImports = [
    config_1.ConfigModule.forRoot({ isGlobal: true }),
    typeorm_1.TypeOrmModule.forRootAsync({
        inject: [config_1.ConfigService],
        useFactory: (config) => {
            const isProd = config.get('NODE_ENV') === 'production';
            const databaseUrl = config.get('DATABASE_URL');
            const sslEnv = config.get('POSTGRES_SSL');
            const pgSslMode = config.get('PGSSLMODE');
            const urlHasRequire = databaseUrl === null || databaseUrl === void 0 ? void 0 : databaseUrl.includes('sslmode=require');
            const enableSsl = sslEnv === 'true' || pgSslMode === 'require' || !!urlHasRequire;
            if (databaseUrl) {
                return {
                    type: 'postgres',
                    url: databaseUrl,
                    ssl: enableSsl ? { rejectUnauthorized: false } : undefined,
                    autoLoadEntities: true,
                    synchronize: !isProd,
                };
            }
            return {
                type: 'postgres',
                host: config.get('POSTGRES_HOST', 'localhost'),
                port: parseInt(config.get('POSTGRES_PORT', '5432'), 10),
                username: config.get('POSTGRES_USER', 'postgres'),
                password: config.get('POSTGRES_PASSWORD', 'postgres'),
                database: config.get('POSTGRES_DB', 'tasks_db'),
                ssl: enableSsl ? { rejectUnauthorized: false } : undefined,
                autoLoadEntities: true,
                synchronize: !isProd,
            };
        },
    }),
    users_module_1.UsersModule,
    tasks_module_1.TasksModule,
    events_module_1.EventsModule,
    auth_module_1.AuthModule,
];
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: baseImports,
    })
], AppModule);
//# sourceMappingURL=app.module.js.map