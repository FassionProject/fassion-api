import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { ProductEntity } from '@src/product-management/product/product.model';
import * as moment from 'moment';

export class ProductImageEntity implements Prisma.ProductImageGetPayload<{}> {
  @ApiProperty({ example: randomUUID() })
  id: string;

  @ApiProperty({ example: randomUUID() })
  productId: string;

  @ApiProperty({
    example: `product/store_name/product_name_${moment().unix()}.png`,
  })
  image: string;

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

  constructor(partial: Partial<ProductImageEntity>) {
    Object.assign(this, partial);
  }
}

export class CreateProductImageRequest {
  @ApiProperty({ example: randomUUID(), required: false })
  productId: string | null = null;

  @ApiProperty({
    type: 'file',
    required: false,
    isArray: true,
    format: 'binary',
  })
  images: Express.Multer.File[];
}

export class UpdateProductImageRequest {
  @ApiProperty({ example: 'Kaos', required: true })
  image: string;
}

export class ProductImageGetAllRequest {
  @ApiProperty({ required: false })
  page: number = 1;

  @ApiProperty({ required: false })
  pageSize: number = 10;

  @ApiProperty({ required: false })
  search: string = null;

  @ApiProperty({ required: false })
  productId: string = null;

  @ApiProperty({ required: false })
  withProduct: boolean = false;
}
