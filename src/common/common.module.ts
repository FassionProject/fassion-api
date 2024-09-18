import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { ValidationService } from './validation/validation.service';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AuthMiddleware } from './auth/auth.middleware';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './error/error.filter';
import { FileManagerService } from './file-manager/file-manager.service';
import { FileManagerController } from './file-manager/file-manager.controller';

@Global()
@Module({
  controllers: [FileManagerController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot({
      format: winston.format.prettyPrint(),
      level: 'info',
      transports: [new winston.transports.Console()],
    }),
  ],
  providers: [
    DatabaseService,
    ValidationService,
    FileManagerService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
  exports: [DatabaseService, ValidationService, FileManagerService],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude('login').forRoutes('*');
  }
}
