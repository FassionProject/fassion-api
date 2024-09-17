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
  categories = [
    {
      description: 'Baju dan Celana',
      subCategories: [
        {
          description: 'Atasan',
          subCategories: [{ description: 'Kaos' }, { description: 'Kemeja' }],
        },
        { description: 'Bawahan' },
        { description: 'Dress & Setelan' },
        { description: 'Pakaian Santai (Casual Wear)' },
      ],
    },
    {
      description: 'Sepatu',
      subCategories: [],
    },
    {
      description: 'Aksesoris',
      subCategories: [],
    },
    {
      description: 'Tas',
      subCategories: [],
    },
  ];

  async seed() {
    await this.prisma.productCategory.deleteMany({
      where: {
        createdBy: auditInfo.createdBy,
      },
    });

    this.categories.forEach(async (category) => {
      await this.create(category);
    });
  }

  async create(category: any, parent?: any) {
    const data = await this.prisma.productCategory.create({
      data: {
        id: randomUUID(),
        description: category.description,
        parentId: parent,
        ...auditInfo,
      },
    });

    if (category.subCategories) {
      for (const sub of category.subCategories) {
        await this.create(sub, data.id);
      }
    }
  }
}
