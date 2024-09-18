import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
@Injectable()
export class DatabaseService
  extends PrismaClient<Prisma.PrismaClientOptions, string>
  implements OnModuleInit
{
  constructor(
    private config: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {
    super({
      log: [
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'query',
        },
      ],
    });

    this.logger.info(
      `Connected to database at ${this.config.get('DATABASE_URL')}`,
    );
  }
  async onModuleInit() {
    this.$on('query', (e) => {
      this.logger.info(e);
    });

    this.$on('error', (e) => {
      this.logger.error(e);
    });

    this.$on('warn', (e) => {
      this.logger.warn(e);
    });

    this.$on('info', (e) => {
      this.logger.info(e);
    });

    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
