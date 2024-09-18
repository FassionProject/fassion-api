import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';
import * as moment from 'moment';
import { ProductCategoryEntity } from '../product-category/product-category.model';

export class ProductEntity implements Prisma.ProductGetPayload<{}> {
  @ApiProperty({ example: randomUUID() })
  id: string | null = null;

  @ApiProperty({ example: randomUUID() })
  storeId: string | null = null;

  @ApiProperty({ example: randomUUID() })
  categoryId: string | null = null;

  @ApiProperty({ example: 'Kaos Oblong' })
  name: string | null = null;

  @ApiProperty({
    example: 'Kaos nyaman di pakai untuk kamu. Tersedia warna putih dan hitam',
  })
  description: string | null = null;

  @ApiProperty({ example: null })
  thumbnail: string | null;

  @ApiProperty({ example: 50000 })
  price: number | null = null;

  @ApiProperty({ example: 10 })
  stock: number | null = null;

  @ApiProperty({ example: moment().toDate() })
  createdAt: Date | null = null;

  @ApiProperty({ example: 'Admin' })
  createdBy: string | null = null;

  @ApiProperty({ example: '127.0.0.1' })
  createdIp: string | null = null;

  @ApiProperty({ example: moment().toDate() })
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
    // partial.category =
    //   partial.category ?? new ProductCategoryEntity(partial.category);
    Object.assign(this, partial);
  }
}

export class CreateProductRequest {
  @ApiProperty({ example: randomUUID(), required: false })
  storeId?: string;

  @ApiProperty({ example: randomUUID(), required: false })
  categoryId: string;

  @ApiProperty()
  tagsId: string[];

  @ApiProperty({ example: 'Kaos Oblong', required: true })
  name: string;

  @ApiProperty({
    example: 'Kaos nyaman di pakai untuk kamu. Tersedia warna putih dan hitam',
    required: true,
  })
  description: string;

  @ApiProperty({ example: 50000, required: true })
  price: number;

  @ApiProperty({ example: 10, required: true })
  stock?: number;

  @ApiProperty({
    type: 'file',
    required: false,
    isArray: true,
    format: 'binary',
  })
  images?: Express.Multer.File;
}

export class UpdateProductRequest {
  @ApiProperty({ example: randomUUID(), required: false })
  categoryId?: string;

  @ApiProperty({ example: 'Kaos Oblong', required: false })
  name?: string;

  @ApiProperty({ example: 'Kaos nyaman', required: false })
  description?: string;

  @ApiProperty({ example: 15000, required: false })
  price?: number;

  @ApiProperty({ example: 10, required: false })
  stock?: number;
}

export class ProductGetAllRequest {
  @ApiProperty({ example: 1, required: false })
  page?: number = 1;

  @ApiProperty({ example: 10, required: false })
  pageSize?: number;

  @ApiProperty({ example: 'Kaos Oblong', required: false })
  search?: string;

  @ApiProperty({ required: false })
  priceFrom?: number;

  @ApiProperty({ required: false })
  priceTo?: number;

  @ApiProperty({ required: false })
  stockFrom?: number;

  @ApiProperty({ required: false })
  stockTo?: number;

  @ApiProperty({ required: false })
  categoryId?: string;

  @ApiProperty({ required: false })
  tagsId?: string[];

  @ApiProperty({ required: false })
  storeId?: string;

  @ApiProperty({ required: false })
  withStore?: boolean;

  @ApiProperty({ required: false })
  withCategory?: boolean;

  @ApiProperty({ required: false })
  withTags?: boolean;
}
