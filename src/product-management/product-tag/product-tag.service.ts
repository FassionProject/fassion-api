import { Inject, Injectable } from '@nestjs/common';
import {
  CreateProductTagRequest,
  ProductTagEntity,
  ProductTagGetAllRequest,
  UpdateProductTagRequest,
} from './product-tag.model';
import { DatabaseService } from '../../common/database/database.service';
import { ValidationService } from '../../common/validation/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ProductTagValidation } from './product-tag.validation';
import { Audit } from '../../common/audit/audit.model';
import { randomUUID } from 'crypto';
import { Utils } from '../../utils/utils';
import { ListModel } from '@src/utils/model/list-model.model';
import { Prisma } from '@prisma/client';
import { ProductEntity } from '../product/product.model';

@Injectable()
export class ProductTagService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly db: DatabaseService,
    private readonly validation: ValidationService,
  ) {}
  async create(
    request: CreateProductTagRequest,
    audit: Audit,
  ): Promise<ProductTagEntity> {
    const validData: CreateProductTagRequest = this.validation.validate(
      ProductTagValidation.CREATE,
      request,
    );

    const { productTag } = await this.db.$transaction(async (t) => {
      const result = await this.db.productTag.create({
        data: {
          id: randomUUID(),
          storeId: validData.storeId,
          description: validData.description,
          createdAt: audit.timestamp,
          createdBy: audit.user,
          createdIp: audit.ip,
          updatedAt: audit.timestamp,
          updatedBy: audit.user,
          updatedIp: audit.ip,
        },
      });

      return { productTag: new ProductTagEntity(result) };
    });

    return productTag;
  }

  async findAll({
    page,
    pageSize,
    search,
    withProduct,
    storeId,
  }: ProductTagGetAllRequest): Promise<ListModel<ProductTagEntity>> {
    const { skip, take } = Utils.skipAndTakeAttribute(page, pageSize);
    const searchFilters: Prisma.ProductTagWhereInput[] = [
      {
        description: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ];

    const filters: Prisma.ProductTagWhereInput[] = [
      {
        storeId: storeId,
      },
    ];

    const where: Prisma.ProductTagWhereInput = {
      AND: [...searchFilters, ...filters],
    };

    const { count, productTags } = await this.db.$transaction(async (t) => {
      const count = await t.productTag.count({
        where: where,
      });

      const result = await t.productTag.findMany({
        where: where,
        skip,
        take,
        include: {
          products: withProduct ? true : false,
        },
      });

      return {
        count,
        productTags: result.map((productTag) => {
          if (productTag.products) {
            productTag.products = productTag.products.map(
              (product) => new ProductEntity(product),
            );
          }

          return new ProductTagEntity(productTag);
        }),
      };
    });
    return {
      total: count,
      items: productTags,
    };
  }

  async findOne(id: string): Promise<ProductTagEntity> {
    const { productTag } = await this.db.$transaction(async (t) => {
      const result = new ProductTagEntity(
        await t.productCategory.findUnique({
          where: {
            id: id,
          },
        }),
      );

      return { productTag: result };
    });
    return productTag;
  }

  async update(
    id: string,
    request: UpdateProductTagRequest,
    audit: Audit,
  ): Promise<ProductTagEntity> {
    const validData = this.validation.validate<UpdateProductTagRequest>(
      ProductTagValidation.UPDATE,
      request,
    );

    const { productTag } = await this.db.$transaction(async (t) => {
      const productTag = await this.db.productTag.update({
        where: {
          id: id,
        },
        data: {
          description: validData.description,
          updatedAt: audit.timestamp,
          updatedBy: audit.user,
          updatedIp: audit.ip,
        },
      });

      return { productTag: new ProductTagEntity(productTag) };
    });

    return productTag;
  }

  async remove(id: string, audit: Audit): Promise<ProductTagEntity> {
    const { productTag } = await this.db.$transaction(async (t) => {
      const totalDeleted = await t.productTag.count({
        where: {
          id: id,
          deletedAt: null,
        },
      });

      let result: any = {};

      if (totalDeleted == 0) {
        result = await t.productTag.update({
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
        result = await t.productTag.delete({
          where: {
            id: id,
          },
        });
      }

      return { productTag: new ProductTagEntity(result) };
    });
    return productTag;
  }
}
