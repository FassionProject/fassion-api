import { HttpException, Inject, Injectable } from '@nestjs/common';
import {
  CreateProductReviewRequest,
  ProductReviewEntity,
  ProductReviewGetAllRequest,
  UpdateProductReviewRequest,
} from './product-review.model';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { DatabaseService } from '../../common/database/database.service';
import { ValidationService } from '../../common/validation/validation.service';
import { ProductReviewValidation } from './product-review.validation';
import { randomUUID } from 'crypto';
import { Audit } from '../../common/audit/audit.model';
import { Utils } from '../../utils/utils';
import { Prisma } from '@prisma/client';
import { ListModel } from '@src/utils/model/list-model.model';
import { ZodError } from 'zod';

@Injectable()
export class ProductReviewService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly db: DatabaseService,
    private readonly validation: ValidationService,
  ) {}
  async create(
    request: CreateProductReviewRequest,
    audit: Audit,
  ): Promise<ProductReviewEntity> {
    const data: CreateProductReviewRequest =
      this.validation.validate<CreateProductReviewRequest>(
        ProductReviewValidation.CREATE,
        request,
      );

    const { productReview } = await this.db.$transaction(async (t) => {
      const TotalProductReviewWithSameDescriptionOnSameLevel =
        await t.productReview.count({
          where: {
            AND: [
              {
                userId: data.userId,
              },
              {
                productId: data.productId,
              },
            ],
          },
        });

      if (TotalProductReviewWithSameDescriptionOnSameLevel > 0) {
        throw new HttpException(`You have already reviewed this product`, 400);
      }

      const result = await this.db.productReview.create({
        data: {
          id: randomUUID(),
          productId: data.productId,
          userId: data.userId,
          rating: data.rating,
          comment: data.comment,
          createdAt: audit.timestamp,
          createdBy: audit.user,
          createdIp: audit.ip,
          updatedAt: audit.timestamp,
          updatedBy: audit.user,
          updatedIp: audit.ip,
        },
      });

      return { productReview: new ProductReviewEntity(result) };
    });

    this.logger.info(
      `Product Review created: ${JSON.stringify(productReview)}`,
    );

    return productReview;
  }

  async findAll({
    page,
    pageSize,
    search,
    productId,
    withProduct,
  }: ProductReviewGetAllRequest): Promise<ListModel<ProductReviewEntity>> {
    const { skip, take } = Utils.skipAndTakeAttribute(page, pageSize);

    const searchFilters: Prisma.ProductReviewWhereInput[] = [
      {
        comment: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ];
    const filters: Prisma.ProductReviewWhereInput[] = [
      {
        productId: productId,
      },
    ];

    const where: Prisma.ProductReviewWhereInput = {
      AND: [...searchFilters, ...filters],
    };

    const { productReviews, count } = await this.db.$transaction(async (t) => {
      const count = await t.productReview.count({
        where: where,
      });
      const result = await t.productReview.findMany({
        skip: skip,
        take: take,
        where: where,
        orderBy: { createdAt: 'desc' },
        include: {
          product: withProduct ? true : false,
        },
      });

      const productReviews = result.map(
        (review) => new ProductReviewEntity(review),
      );

      return {
        productReviews,
        count,
      };
    });

    return new ListModel<ProductReviewEntity>({
      total: count,
      items: productReviews,
    });
  }

  async findOne(id: string): Promise<ProductReviewEntity> {
    // return fields;

    const result = await this.db.$transaction(async (t) => {
      const result = await t.productReview.findUnique({
        where: {
          id: id,
        },
      });

      return new ProductReviewEntity(result);
    });
    return result;
  }

  async update(
    id: string,
    request: UpdateProductReviewRequest,
    audit: Audit,
  ): Promise<ProductReviewEntity> {
    const validData = this.validation.validate<UpdateProductReviewRequest>(
      ProductReviewValidation.UPDATE,
      request,
    );

    const { productReview } = await this.db.$transaction(async (t) => {
      const productReview = await this.db.productReview.update({
        where: {
          id: id,
        },
        data: {
          comment: validData.comment,
          rating: validData.rating,
          updatedAt: audit.timestamp,
          updatedBy: audit.user,
          updatedIp: audit.ip,
        },
      });

      return { productReview: new ProductReviewEntity(productReview) };
    });

    return productReview;
  }

  async remove(id: string, audit: Audit): Promise<ProductReviewEntity> {
    const { productReview } = await this.db.$transaction(async (t) => {
      const totalDeleted = await t.productReview.count({
        where: {
          id: id,
          deletedAt: null,
        },
      });

      let result: ProductReviewEntity | null = null;

      if (totalDeleted == 0) {
        result = await t.productReview.update({
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
        result = await t.productReview.delete({
          where: {
            id: id,
          },
        });
      }

      return { productReview: new ProductReviewEntity(result) };
    });
    return productReview;
  }
}
