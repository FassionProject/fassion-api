import { ApiBody, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { ProductCategoryResponse } from '../product-category/product-category.model';
import { randomUUID } from 'crypto';

export class ProductResponse {
  @ApiProperty({ example: randomUUID() })
  id: string;

  @ApiProperty({ example: randomUUID() })
  storeId: string;

  @ApiProperty({ example: randomUUID() })
  categoryId: string;

  @ApiProperty({ example: 'Kaos Oblong' })
  name: string;

  @ApiProperty({
    example: 'Kaos nyaman di pakai untuk kamu. Tersedia warna putih dan hitam',
  })
  description: string;

  @ApiProperty({ example: null })
  thumbnail: string;

  @ApiProperty({ example: 50000 })
  price: number;

  @ApiProperty({ example: 10 })
  stock: number;

  @ApiProperty({
    allOf: [{ $ref: getSchemaPath(ProductCategoryResponse) }],
  })
  category: ProductCategoryResponse;
  // tags: string;
  // images: string;
}

export class ProductWithCategoryResponse extends ProductResponse {
  @ApiProperty({ allOf: [{ $ref: getSchemaPath(ProductCategoryResponse) }] })
  category: ProductCategoryResponse;
}

export class CreateProductRequest {
  @ApiProperty({ example: randomUUID(), required: false })
  storeId?: string;

  @ApiProperty({ example: randomUUID(), required: false })
  categoryId: string;

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
}

export class UpdateProductRequest {
  categoryId?: string;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}
