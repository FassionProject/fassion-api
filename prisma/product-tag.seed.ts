import { Prisma, PrismaClient } from '@prisma/client';
import { auditInfo } from './seed';
import { randomUUID } from 'crypto';

export class ProductCategorySeeder {
  prisma: PrismaClient;
  /**
   *
   */
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  tags = [
    {
      description: 'Kaos pria',
    },
    {
      description: 'Sepatu Pantofel',
    },
    {
      description: 'Gelang Emas',
    },
    {
      description: 'Kemeja Flanel',
    },
    {
      description: 'Jeans Denim',
    },
  ];

  async seed() {
    await this.prisma.productTag.deleteMany({
      where: {
        createdBy: auditInfo.createdBy,
      },
    });

    this.tags.forEach(async (tag) => {
      await this.create(tag);
    });
  }

  async create(tag: any, parent?: any) {
    const data = await this.prisma.productTag.create({
      data: {
        id: randomUUID(),
        description: tag.description,
        ...auditInfo,
      },
    });
  }
}
