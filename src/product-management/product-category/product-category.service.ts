import { HttpException, Inject, Injectable } from '@nestjs/common';
import {
  CreateProductCategoryRequest,
  ProductCategoryEntity,
  ProductCategoryGetAllRequest,
  UpdateProductCategoryRequest,
} from './product-category.model';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { DatabaseService } from '../../common/database/database.service';
import { ValidationService } from '../../common/validation/validation.service';
import { ProductCategoryValidation } from './product-category.validation';
import { randomUUID } from 'crypto';
import { Audit } from '../../common/audit/audit.model';
import { Utils } from '../../utils/utils';
import { Prisma } from '@prisma/client';
import { ListModel } from '@src/utils/model/list-model.model';

@Injectable()
export class ProductCategoryService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly db: DatabaseService,
    private readonly validation: ValidationService,
  ) {}
  async create(
    request: CreateProductCategoryRequest,
    audit: Audit,
  ): Promise<ProductCategoryEntity> {
    const data: CreateProductCategoryRequest =
      this.validation.validate<CreateProductCategoryRequest>(
        ProductCategoryValidation.CREATE,
        request,
      );

    const { productCategory } = await this.db.$transaction(async (t) => {
      const TotalProductCategoryWithSameDescriptionOnSameLevel =
        await t.productCategory.count({
          where: {
            AND: [
              {
                description: data.description,
              },
              {
                parentId: data.parentId,
              },
            ],
          },
        });

      if (TotalProductCategoryWithSameDescriptionOnSameLevel > 0) {
        throw new HttpException(
          `Category ${data.description} already exists`,
          400,
        );
      }

      const result = await this.db.productCategory.create({
        data: {
          id: randomUUID(),
          description: data.description,
          parentId: data.parentId,
          createdAt: audit.timestamp,
          createdBy: audit.user,
          createdIp: audit.ip,
          updatedAt: audit.timestamp,
          updatedBy: audit.user,
          updatedIp: audit.ip,
        },
      });

      return { productCategory: new ProductCategoryEntity(result) };
    });

    this.logger.info(
      `Product Category created: ${JSON.stringify(productCategory)}`,
    );

    return productCategory;
  }

  async findAll({
    page,
    pageSize,
    search,
    parentId,
    withProduct,
  }: ProductCategoryGetAllRequest): Promise<ListModel<ProductCategoryEntity>> {
    const { skip, take } = Utils.skipAndTakeAttribute(page, pageSize);

    const searchFilters: Prisma.ProductCategoryWhereInput[] = [
      {
        description: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ];
    const filters: Prisma.ProductCategoryWhereInput[] = [
      {
        parentId: parentId,
      },
    ];

    const where: Prisma.ProductCategoryWhereInput = {
      AND: [...searchFilters, ...filters],
    };

    const { productCategories, count } = await this.db.$transaction(
      async (t) => {
        const count = await t.productCategory.count({
          where: where,
        });
        const result = await this.db.productCategory.findMany({
          skip: skip,
          take: take,
          where: where,
          orderBy: { description: 'asc' },
          include: {
            products: withProduct ? true : false,
          },
        });

        const productCategories = await Promise.all(
          result.map(async (x) => {
            const productCategory = new ProductCategoryEntity(x);

            if (productCategory.parentId) {
              productCategory.parent = await this.loadParent(
                productCategory.parentId,
              );
            }

            return productCategory;
          }),
        );

        return {
          productCategories,
          count,
        };
      },
    );

    return new ListModel<ProductCategoryEntity>({
      total: count,
      items: productCategories,
    });
  }

  mappingChild(obj, source: any) {
    return obj.map((o) => {
      const children = source.filter((x) => x.parentId == o.id);

      o.subCategories = this.mappingChild(children, source);

      return o;
    });
  }

  async findOne(id: string): Promise<any> {
    // return fields;

    const result = await this.db.$transaction(async (t) => {
      const result = new ProductCategoryEntity(
        await t.productCategory.findUnique({
          where: {
            id: id,
          },
        }),
      );

      if (result.parentId) {
        result.parent = await this.loadParent(result.parentId);
      }

      return result;
    });
    return result;
  }

  async loadParent(id: string): Promise<ProductCategoryEntity> {
    const result = await this.db.productCategory.findUnique({
      where: {
        id: id,
      },
    });

    if (!result) {
      return null;
    }

    const data = new ProductCategoryEntity(result);

    if (data.parentId) {
      data.parent = await this.loadParent(data.parentId);
    }

    return data;
  }

  async update(
    id: string,
    request: UpdateProductCategoryRequest,
    audit: Audit,
  ): Promise<ProductCategoryEntity> {
    const validData = this.validation.validate<UpdateProductCategoryRequest>(
      ProductCategoryValidation.UPDATE,
      request,
    );

    const { productCategory } = await this.db.$transaction(async (t) => {
      const productCategory = await this.db.productCategory.update({
        where: {
          id: id,
        },
        data: {
          description: validData.description,
          parentId: validData.parentId,
          updatedAt: audit.timestamp,
          updatedBy: audit.user,
          updatedIp: audit.ip,
        },
      });

      return { productCategory: new ProductCategoryEntity(productCategory) };
    });

    return productCategory;
  }

  async remove(id: string, audit: Audit): Promise<ProductCategoryEntity> {
    const { productCategory } = await this.db.$transaction(async (t) => {
      const totalDeleted = await t.productCategory.count({
        where: {
          id: id,
          deletedAt: null,
        },
      });

      let result: any = {};

      if (totalDeleted == 0) {
        result = await t.productCategory.update({
          where: {
            id: id,
          },
          data: {
            deletedAt: audit.timestamp,
            deletedBy: audit.user,
            deletedIp: audit.ip,
          },
        });
      } else {
        result = await t.productCategory.delete({
          where: {
            id: id,
          },
        });
      }

      return { productCategory: new ProductCategoryEntity(result) };
    });
    return productCategory;
  }
}
