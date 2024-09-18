import { Inject, Injectable } from '@nestjs/common';
import {
  CreateProductImageRequest,
  ProductImageEntity,
  ProductImageGetAllRequest,
  UpdateProductImageRequest,
} from './product-image.model';
import { DatabaseService } from '../../common/database/database.service';
import { ValidationService } from '../../common/validation/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ProductImageValidation } from './product-image.validation';
import { Audit } from '../../common/audit/audit.model';
import { randomUUID } from 'crypto';
import { Utils } from '../../utils/utils';
import { ListModel } from '@src/utils/model/list-model.model';
import { Prisma } from '@prisma/client';
import { ProductEntity } from '../product/product.model';
import * as moment from 'moment';
import { FileManagerService } from '@src/common/file-manager/file-manager.service';

@Injectable()
export class ProductImageService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly db: DatabaseService,
    private readonly validation: ValidationService,
    private readonly fileManager: FileManagerService,
  ) {}
  async create(
    request: CreateProductImageRequest,
    images: Express.Multer.File[],
    audit: Audit,
  ): Promise<ListModel<ProductImageEntity>> {
    const validData: CreateProductImageRequest = this.validation.validate(
      ProductImageValidation.CREATE,
      { productId: request.productId, images },
    );

    const { productImages, total } = await this.db.$transaction(async (t) => {
      const product = await t.product.findUnique({
        where: {
          id: validData.productId,
        },
      });

      const path = `product/store/${product.name}/`;

      const result: Prisma.ProductImageGetPayload<{}>[] = [];

      for (const image of images) {
        const ext = image.originalname.split('.').pop();
        image.destination = path;
        image.filename = `${product.name}-${randomUUID().slice(0, 5)}-${moment().format('YYYYMMDDHHmmss')}.${ext}`;

        const saved = await this.fileManager.save(image, audit);

        result.push(
          await t.productImage.create({
            data: {
              id: randomUUID(),
              image: saved.file,
              productId: validData.productId,
              createdAt: audit.timestamp,
              createdBy: audit.user,
              createdIp: audit.ip,
              updatedAt: audit.timestamp,
              updatedBy: audit.user,
              updatedIp: audit.ip,
            },
          }),
        );

        return {
          productImages: result.map((i) => new ProductImageEntity(i)),
          total: result.length,
        };
      }
    });

    return {
      total,
      items: productImages,
    };
  }

  async findAll({
    page,
    pageSize,
    search,
    productId,
    withProduct,
  }: ProductImageGetAllRequest): Promise<ListModel<ProductImageEntity>> {
    const { skip, take } = Utils.skipAndTakeAttribute(page, pageSize);
    const searchFilters: Prisma.ProductImageWhereInput[] = [
      {
        image: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ];

    const filters: Prisma.ProductImageWhereInput[] = [
      {
        productId: productId,
      },
    ];

    const where: Prisma.ProductImageWhereInput = {
      AND: [...searchFilters, ...filters],
    };

    const { count, productImages } = await this.db.$transaction(async (t) => {
      const count = await t.productImage.count({
        where: where,
      });

      const result = await t.productImage.findMany({
        where: where,
        skip,
        take,
        include: {
          product: withProduct ? true : false,
        },
      });

      return {
        count,
        productImages: result.map((productImage) => {
          return new ProductImageEntity(productImage);
        }),
      };
    });
    return {
      total: count,
      items: productImages,
    };
  }

  async findOne(id: string): Promise<ProductImageEntity> {
    const { productImage } = await this.db.$transaction(async (t) => {
      const result = new ProductImageEntity(
        await t.productCategory.findUnique({
          where: {
            id: id,
          },
        }),
      );

      return { productImage: result };
    });
    return productImage;
  }

  async remove(id: string, audit: Audit): Promise<ProductImageEntity> {
    const { productImage } = await this.db.$transaction(async (t) => {
      const productImage = await t.productImage.findUnique({
        where: {
          id: id,
        },
        select: {
          id: true,
          image: true,
          deletedAt: true,
        },
      });

      let result: any = {};

      this.fileManager.delete(productImage.image, audit);

      if (productImage.deletedAt) {
        result = await t.productImage.update({
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
        result = await t.productImage.delete({
          where: {
            id: id,
          },
        });
      }

      return { productImage: new ProductImageEntity(result) };
    });
    return productImage;
  }
}
