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

    createModelExtends(this);

    this.logger.info(
      `Connected to database at ${this.config.get('DATABASE_URL')}`,
    );
  }
  onModuleInit() {
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
  }
}

function getFileName(file: string): string {
  return file.split(/[\/\\]/).pop();
}

function createModelExtends(prismaClient: PrismaClient) {
  prismaClient.$extends({
    result: {
      file: {
        name: {
          needs: { file: true },
          compute(data) {
            return getFileName(data.file);
          },
        },
        ext: {
          needs: { file: true },
          compute(data) {
            return getFileName(data.file).split('.').pop();
          },
        },
        path: {
          needs: { file: true },
          compute(data) {
            const pathArray = data.file.split(/[\/\\]/);
            return pathArray.slice(0, pathArray.length - 1).join('/') + '/';
          },
        },
      },
    },
  });
}
