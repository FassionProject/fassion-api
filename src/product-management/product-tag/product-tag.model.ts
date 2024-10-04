import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { ProductEntity } from '@src/product-management/product/product.model';
import * as moment from 'moment';

export class ProductTagEntity
  implements Prisma.ProductTagGetPayload<{ include: { products: true } }>
{
  @ApiProperty({ example: randomUUID() })
  id: string;

  @ApiProperty({ example: randomUUID() })
  storeId: string;

  @ApiProperty({ example: 'Kaos' })
  description: string;

  @ApiProperty({ type: ProductEntity, isArray: true })
  products: ProductEntity[];

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

  constructor(partial: Partial<ProductTagEntity>) {
    Object.assign(this, partial);
  }
}

export class CreateProductTagRequest {
  @ApiProperty({ example: randomUUID(), required: false })
  storeId: string | null = null;

  @ApiProperty({ example: 'Kaos', required: true })
  description: string;
}

export class UpdateProductTagRequest {
  @ApiProperty({ example: 'Kaos', required: true })
  description: string;
}

export class ProductTagGetAllRequest {
  @ApiProperty({ required: false })
  page: number = 1;

  @ApiProperty({ required: false })
  pageSize: number = 10;

  @ApiProperty({ required: false })
  search: string = null;

  @ApiProperty({ required: false })
  storeId: string = null;

  @ApiProperty({ required: false })
  withProduct: boolean = false;
}
