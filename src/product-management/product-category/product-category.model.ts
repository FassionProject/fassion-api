import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { ProductEntity } from '../product/product.model';
import { Prisma } from '@prisma/client';
import * as moment from 'moment';

export class ProductCategoryEntity
  implements Prisma.ProductCategoryGetPayload<{ include: { parent: true } }>
{
  @ApiProperty({ example: randomUUID() })
  id: string | null;

  @ApiProperty({ example: null })
  parentId: string | null;

  @ApiProperty({ example: 'Kaos' })
  description: string | null;

  @ApiProperty()
  parent: ProductCategoryEntity | null;

  @ApiProperty({ type: [ProductEntity] })
  products: ProductEntity[] = [];

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

  constructor(partial: Partial<ProductCategoryEntity>) {
    Object.assign(this, partial);
  }
}
export class CreateProductCategoryRequest {
  @ApiProperty({ example: null, required: false })
  parentId: string | null = null;

  @ApiProperty({ example: 'Atasan', required: true })
  description: string = null;
}

export class UpdateProductCategoryRequest {
  @ApiProperty({ example: null })
  parentId: string | null = null;

  @ApiProperty({ example: 'Atasan', required: false })
  description?: string = null;
}

export class ProductCategoryGetAllRequest {
  @ApiProperty({ required: false })
  parentId: string | null = null;

  @ApiProperty({ required: false })
  page: number = 1;

  @ApiProperty({ required: false })
  pageSize: number = 10;

  @ApiProperty({ required: false })
  search: string = null;

  @ApiProperty({ required: false })
  withProduct: boolean = false;
}
