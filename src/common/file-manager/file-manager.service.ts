import { Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { DatabaseService } from '../database/database.service';
import { ValidationService } from '../validation/validation.service';
import { Audit } from '../audit/audit.model';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

@Injectable()
export class FileManagerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly db: DatabaseService,
    private readonly validation: ValidationService,
  ) {}

  async save(
    file: Express.Multer.File,
    audit: Audit,
  ): Promise<Prisma.FileGetPayload<{}> | null> {
    try {
      if (file.destination.endsWith('/')) {
        file.destination = file.destination.replace(/\/$/, '');
      }

      if (file.destination.startsWith('/')) {
        file.destination = file.destination.replace(/^\//, '');
      }

      if (file.filename.startsWith('/')) {
        file.filename = file.filename.replace(/^\//, '');
      }

      file.originalname;

      const fileName = file.destination + '/' + file.filename;
      const uploaded = await this.db.file.create({
        data: {
          file: fileName.toLocaleLowerCase().replaceAll(' ', '_'),
          mimetype: file.mimetype,
          content: file.buffer,
          createdAt: audit.timestamp,
          createdBy: audit.user,
          createdIp: audit.ip,
          updatedAt: audit.timestamp,
          updatedBy: audit.user,
          updatedIp: audit.ip,
        },
      });

      return uploaded;
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  async get(fullPath: string): Promise<Prisma.FileGetPayload<{}> | null> {
    try {
      return await this.db.file.findUnique({
        where: {
          file: fullPath,
        },
      });
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  async getAll(path: string | undefined): Promise<Prisma.FileGetPayload<{}>[]> {
    try {
      return await this.db.file.findMany({
        where: {
          file: {
            contains: path,
          },
        },
      });
    } catch (error) {
      this.logger.error(error);
      return [];
    }
  }

  async delete(
    fullPath: string,
    audit: Audit,
    force: boolean = false,
  ): Promise<Prisma.FileGetPayload<{}> | null> {
    try {
      if (force) {
        return await this.db.file.delete({
          where: {
            file: fullPath,
          },
        });
      }

      const file = await this.db.file.findUnique({
        where: {
          file: fullPath,
          deletedAt: null,
        },
      });

      if (file) {
        return await this.db.file.update({
          where: {
            file: file.file,
          },
          data: {
            deletedAt: audit.timestamp,
            deletedBy: audit.user,
            deletedIp: audit.ip,
          },
        });
      } else {
        return await this.delete(fullPath, audit, true);
      }
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }
}
