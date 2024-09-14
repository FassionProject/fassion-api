import { Module } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { ValidationService } from './validation/validation.service';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot({
      format: winston.format.json(),
      level: 'info',
      transports: [new winston.transports.Console()],
    }),
  ],
  providers: [DatabaseService, ValidationService],
  exports: [DatabaseService, ValidationService],
})
export class CommonModule {}
