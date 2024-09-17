import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { ProductEntity } from '../product/product.model';
import { Prisma } from '@prisma/client';

export class ProductCategoryEntity
  implements Prisma.ProductCategoryGetPayload<{ include: { parent: true } }>
{
  @ApiProperty({ example: randomUUID() })
  id: string | null = null;

  @ApiProperty({ example: null })
  parentId: string | null = null;

  @ApiProperty({ example: 'Kaos' })
  description: string | null = null;

  @ApiProperty()
  parent: ProductCategoryEntity | null = null;

  @ApiProperty({ type: [ProductEntity] })
  products: ProductEntity[] = [];

  @ApiProperty({ example: new Date() })
  createdAt: Date | null = null;

  @ApiProperty({ example: 'Admin' })
  createdBy: string | null = null;

  @ApiProperty({ example: '127.0.0.1' })
  createdIp: string | null = null;

  @ApiProperty({ example: new Date() })
  updatedAt: Date | null = null;

  @ApiProperty({ example: 'Admin' })
  updatedBy: string | null = null;

  @ApiProperty({ example: '127.0.0.1' })
  updatedIp: string | null = null;

  @ApiProperty({ example: null })
  deletedAt: Date | null = null;

  @ApiProperty({ example: null })
  deletedBy: string | null = null;

  @ApiProperty({ example: null })
  deletedIp: string | null = null;

  constructor(partial: Partial<ProductEntity>) {
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
