import { Inject, Injectable } from '@nestjs/common';
import {
  CreateProductRequest,
  ProductEntity,
  ProductGetAllRequest,
  UpdateProductRequest,
} from './product.model';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { DatabaseService } from '@src/common/database/database.service';
import { ValidationService } from '@src/common/validation/validation.service';
import { ProductValidation } from './product.validation';
import { Logger } from 'winston';
import { Audit } from '@src/common/audit/audit.model';
import { randomUUID } from 'crypto';
import { ListModel } from '@src/utils/model/model';
import { Utils } from '@src/utils/utils';
@Injectable()
export class ProductService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly db: DatabaseService,
    private readonly validation: ValidationService,
  ) {}
  async create(
    request: CreateProductRequest,
    audit: Audit,
  ): Promise<ProductEntity> {
    const validData = this.validation.validate<CreateProductRequest>(
      ProductValidation.CREATE,
      request,
    );

    const { product } = await this.db.$transaction(async (t) => {
      const result = await t.product.create({
        data: {
          id: randomUUID(),
          categoryId: validData.categoryId,
          storeId: validData.storeId,
          description: validData.description,
          name: validData.name,
          price: validData.price,
          stock: validData.stock,
          tags: validData.tagsId
            ? {
                connect: validData.tagsId.map((tag) => ({ id: tag })),
              }
            : undefined,

          createdAt: audit.timestamp,
          createdBy: audit.user,
          createdIp: audit.ip,
          updatedAt: audit.timestamp,
          updatedBy: audit.user,
          updatedIp: audit.ip,
        },
      });

      return { product: new ProductEntity(result) };
    });

    return product;
  }

  async findAll({
    page,
    pageSize,
    search,
    categoryId,
    tagsId,
    storeId,
    priceFrom,
    priceTo,
    stockFrom,
    stockTo,
    withStore,
    withCategory,
    withTags,
  }: ProductGetAllRequest): Promise<ListModel<ProductEntity>> {
    const { skip, take } = Utils.skipAndTakeAttribute(+page, +pageSize);

    const searchFilters = [
      {
        category: withCategory
          ? {
              description: {
                contains: search,
              },
            }
          : undefined,
        tags: withTags
          ? {
              some: {
                description: {
                  contains: search,
                },
              },
            }
          : undefined,
        name: {
          contains: search,
        },
      },
    ];
    const filters = [
      {
        price: {
          gte: priceFrom,
          lte: priceTo,
        },
      },
      {
        stock: {
          gte: stockFrom,
          lte: stockTo,
        },
      },
      {
        storeId: storeId,
      },
      {
        categoryId: categoryId,
      },
      {
        tags: {
          every: {
            id: {
              in: tagsId,
            },
          },
        },
      },
    ];

    const { products, count } = await this.db.$transaction(async (t) => {
      const count = await t.product.count({
        where: {
          AND: [...searchFilters, ...filters],
        },
      });
      const result = await t.product.findMany({
        skip: skip,
        take: take,
        where: {
          AND: [...searchFilters, ...filters],
        },
        include: {
          category: withCategory ? true : false,
          tags: withTags ? true : false,
        },
      });

      return {
        count,
        products: result.map((product) => new ProductEntity(product)),
      };
    });
    return new ListModel<ProductEntity>({
      total: count,
      items: products,
    });
  }

  async findOne(id: string): Promise<ProductEntity> {
    const { product } = await this.db.$transaction(async (t) => {
      const result = await t.product.findUnique({
        where: {
          id: id,
        },
      });
      return { product: new ProductEntity(result) };
    });

    return product;
  }

  async update(
    id: string,
    request: UpdateProductRequest,
    audit: Audit,
  ): Promise<ProductEntity> {
    const validData = this.validation.validate<UpdateProductRequest>(
      ProductValidation.UPDATE,
      request,
    );

    const { product } = await this.db.$transaction(async (t) => {
      const result = await t.product.update({
        where: {
          id: id,
        },
        data: {
          categoryId: validData.categoryId,
          description: validData.description,
          name: validData.name,
          price: validData.price,
          stock: validData.stock,
          updatedAt: audit.timestamp,
          updatedBy: audit.user,
          updatedIp: audit.ip,
        },
      });

      return { product: new ProductEntity(result) };
    });

    return product;
  }

  async remove(id: string, audit: Audit): Promise<ProductEntity> {
    const { product } = await this.db.$transaction(async (t) => {
      const totalDeleted = await t.product.count({
        where: {
          id: id,
          deletedAt: {
            not: null,
          },
        },
      });

      let result: ProductEntity;

      if (totalDeleted > 0) {
        result = await t.product.delete({
          where: {
            id: id,
          },
        });
      } else {
        result = await t.product.update({
          where: {
            id: id,
          },
          data: {
            deletedAt: audit.timestamp,
            deletedBy: audit.user,
            deletedIp: audit.ip,
          },
        });
      }

      return { product: new ProductEntity(result) };
    });

    return product;
  }
}
