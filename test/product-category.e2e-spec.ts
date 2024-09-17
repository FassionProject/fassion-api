import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@src/app.module';
import { TestModule } from './test.module';
import { TestService } from './test.service';
import { JsonResponseInterceptor } from '@src/utils/json-response/json-response.interceptor';
import { HTTPLogInterceptor } from '@src/utils/log/http-log.interceptor';
import { DatabaseService } from '@src/common/database/database.service';

describe('ProductCategory (e2e)', () => {
  let app: INestApplication;
  let testService: TestService;
  let db: DatabaseService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalInterceptors(new HTTPLogInterceptor());
    app.useGlobalInterceptors(new JsonResponseInterceptor());
    testService = app.get(TestService);
    db = app.get(DatabaseService);
    await app.init();
  });

  describe('POST /ProductCategory', () => {
    beforeEach(async () => {
      await testService.deleteProductCategories();
    });

    afterAll(async () => {
      await testService.deleteProductCategories();
    });

    it('should create a product category', async () => {
      const response = await request(app.getHttpServer())
        .post('/ProductCategory')
        .send({
          description: 'test',
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(200);
      expect(response.body.result).toBe(1);

      const productCategory = await db.productCategory.findFirst({
        where: { description: 'test' },
      });

      expect(productCategory).not.toBeNull();
      expect(productCategory.id).toBeDefined();
      expect(productCategory.description).toBe('test');
      expect(productCategory.parentId).toBeNull();
      expect(productCategory.createdAt).toBeDefined();
      expect(productCategory.createdIp).toBeDefined();
      expect(productCategory.updatedAt).toBeDefined();
      expect(productCategory.createdIp).toBeDefined();
      expect(productCategory.updatedBy).toBeDefined();
      expect(productCategory.updatedIp).toBeDefined();
      expect(productCategory.deletedAt).toBeNull();
      expect(productCategory.deletedBy).toBeNull();
      expect(productCategory.deletedIp).toBeNull();

      const data = response.body.data;

      expect(data.id).toBe(productCategory.id);
      expect(data.parentId).toBe(productCategory.parentId);
      expect(data.description).toBe(productCategory.description);
      expect(data.parentId).toBe(productCategory.parentId);
      expect(data.createdAt).toBe(productCategory.createdAt.toJSON());
      expect(data.createdBy).toBe(productCategory.createdBy);
      expect(data.createdIp).toBe(productCategory.createdIp);
      expect(data.updatedAt).toBe(productCategory.updatedAt.toJSON());
      expect(data.updatedBy).toBe(productCategory.updatedBy);
      expect(data.updatedIp).toBe(productCategory.updatedIp);
      expect(data.deletedAt).toBe(productCategory.deletedAt);
      expect(data.deletedBy).toBe(productCategory.deletedBy);
      expect(data.deletedIp).toBe(productCategory.deletedIp);
    });

    it('should create a product category with parent', async () => {
      const parent = await testService.createParentProductCategory();

      const response = await request(app.getHttpServer())
        .post('/ProductCategory')
        .send({
          description: 'test',
          parentId: parent.id,
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(200);
      expect(response.body.result).toBe(1);

      const productCategory = await db.productCategory.findFirst({
        where: { description: 'test' },
      });

      expect(productCategory.id).toBeDefined();
      expect(productCategory.description).toBe('test');
      expect(productCategory.parentId).toBe(parent.id);
      expect(productCategory.createdAt).toBeDefined();
      expect(productCategory.createdIp).toBeDefined();
      expect(productCategory.updatedAt).toBeDefined();
      expect(productCategory.createdIp).toBeDefined();
      expect(productCategory.updatedBy).toBeDefined();
      expect(productCategory.updatedIp).toBeDefined();
      expect(productCategory.deletedAt).toBeNull();
      expect(productCategory.deletedBy).toBeNull();
      expect(productCategory.deletedIp).toBeNull();

      const data = response.body.data;

      expect(data.id).toBe(productCategory.id);
      expect(data.parentId).toBe(productCategory.parentId);
      expect(data.description).toBe(productCategory.description);
      expect(data.parentId).toBe(productCategory.parentId);
      expect(data.createdAt).toBe(productCategory.createdAt.toJSON());
      expect(data.createdBy).toBe(productCategory.createdBy);
      expect(data.createdIp).toBe(productCategory.createdIp);
      expect(data.updatedAt).toBe(productCategory.updatedAt.toJSON());
      expect(data.updatedBy).toBe(productCategory.updatedBy);
      expect(data.updatedIp).toBe(productCategory.updatedIp);
      expect(data.deletedAt).toBe(productCategory.deletedAt);
      expect(data.deletedBy).toBe(productCategory.deletedBy);
      expect(data.deletedIp).toBe(productCategory.deletedIp);
    });

    it('should reject a product category with same description on same parent', async () => {
      const child = await testService.createChildProductCategory();

      const response = await request(app.getHttpServer())
        .post('/ProductCategory')
        .send({
          description: child.description,
          parentId: child.parentId,
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(400);
      expect(response.body.result).toBe(-1);
    });
  });

  describe('GET /ProductCategory', () => {});
});
