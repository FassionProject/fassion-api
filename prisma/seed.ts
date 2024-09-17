import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { ProductCategorySeeder } from './product-category.seed';
import * as moment from 'moment';

const prisma: PrismaClient = new PrismaClient();

export const auditInfo = {
  createdAt: moment().toDate(),
  createdBy: 'Seed',
  createdIp: '127.0.0.1',
  updatedAt: moment().toDate(),
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
