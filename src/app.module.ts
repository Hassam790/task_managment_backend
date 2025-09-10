import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// Mongo removed
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';

const baseImports: any[] = [
  ConfigModule.forRoot({ isGlobal: true }),
  TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      const isProd = config.get<string>('NODE_ENV') === 'production';
      const databaseUrl = config.get<string>('DATABASE_URL');
      const sslEnv = config.get<string>('POSTGRES_SSL');
      const pgSslMode = config.get<string>('PGSSLMODE');
      const urlHasRequire = databaseUrl?.includes('sslmode=require');
      const enableSsl = sslEnv === 'true' || pgSslMode === 'require' || !!urlHasRequire;

      if (databaseUrl) {
        return {
          type: 'postgres' as const,
          url: databaseUrl,
          ssl: enableSsl ? { rejectUnauthorized: false } : undefined,
          autoLoadEntities: true,
          synchronize: !isProd,
        };
      }

      return {
        type: 'postgres' as const,
        host: config.get<string>('POSTGRES_HOST', 'localhost'),
        port: parseInt(config.get<string>('POSTGRES_PORT', '5432')!, 10),
        username: config.get<string>('POSTGRES_USER', 'postgres'),
        password: config.get<string>('POSTGRES_PASSWORD', 'postgres'),
        database: config.get<string>('POSTGRES_DB', 'tasks_db'),
        ssl: enableSsl ? { rejectUnauthorized: false } : undefined,
        autoLoadEntities: true,
        synchronize: !isProd,
      };
    },
  }),
  UsersModule,
  TasksModule,
  EventsModule,
  AuthModule,
];

@Module({
  imports: baseImports,
})
export class AppModule {}

