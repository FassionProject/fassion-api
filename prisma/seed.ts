import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { ProductCategorySeeder } from './product-category.seed';

const prisma: PrismaClient = new PrismaClient();

export const auditInfo = {
  createdAt: new Date(),
  createdBy: 'Seed',
  createdIp: '127.0.0.1',
  updatedAt: new Date(),
  updatedBy: 'Seed',
  updatedIp: '127.0.0.1',
  deletedAt: null,
  deletedBy: null,
  deletedIp: null,
};
async function main() {
  await prisma.$transaction(async (t) => {
    new ProductCategorySeeder(prisma).seed();
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
