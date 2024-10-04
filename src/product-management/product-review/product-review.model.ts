import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';
import * as moment from 'moment';

export class ProductReviewEntity implements Prisma.ProductReviewGetPayload<{}> {
  constructor(partial: Partial<ProductReviewEntity>) {
    Object.assign(this, partial);
  }
  @ApiProperty({ example: randomUUID() })
  id: string;

  @ApiProperty({ example: randomUUID() })
  productId: string;

  @ApiProperty({ example: randomUUID() })
  userId: string;

  @ApiProperty({ example: 5 })
  rating: number;

  @ApiProperty({ example: 'Produk nya bagus, saya suka' })
  comment: string;

  @ApiProperty({ example: moment().toDate() })
  createdAt: Date | null;

  @ApiProperty({ example: 'Admin' })
  createdBy: string | null;

  @ApiProperty({ example: '127.0.0.1' })
  createdIp: string | null;

  @ApiProperty({ example: moment().toDate() })
  updatedAt: Date | null;

  @ApiProperty({ example: 'Admin' })
  updatedBy: string | null;

  @ApiProperty({ example: '127.0.0.1' })
  updatedIp: string | null;

  @ApiProperty({ example: null })
  deletedAt: Date | null;

  @ApiProperty({ example: null })
  deletedBy: string | null;

  @ApiProperty({ example: null })
  deletedIp: string | null;
}
export class CreateProductReviewRequest {
  @ApiProperty({ example: null, required: true })
  productId: string | null = null;

  @ApiProperty({ example: null, required: true })
  userId: string | null = null;

  @ApiProperty({ example: 1, required: true })
  rating: number = null;

  @ApiProperty({ example: 'Produk nya bagus, saya suka', required: true })
  comment: string = null;
}

export class UpdateProductReviewRequest {
  @ApiProperty({ example: null, required: true })
  productId: string | null = null;

  @ApiProperty({ example: null, required: true })
  userId: string | null = null;

  @ApiProperty({ example: 1, required: true })
  rating: number = null;

  @ApiProperty({ example: 'Produk nya bagus, saya suka', required: true })
  comment: string = null;
}

export class ProductReviewGetAllRequest {
  @ApiProperty({ required: false })
  productId: string | null = null;

  @ApiProperty({ required: false })
  page: number = 1;

  @ApiProperty({ required: false })
  pageSize: number = 10;

  @ApiProperty({ required: false })
  search: string = null;

  @ApiProperty({ required: false })
  withProduct: boolean = false;
}
