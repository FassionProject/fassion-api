import { ApiBody, ApiProperty } from '@nestjs/swagger';
import { ProductCategoryResponse } from '../product-category/product-category.model';
import { randomUUID } from 'crypto';

export class ProductResponse {
  id: string;
  storeId: string;
  categoryId: string;
  name: string;
  description: string;
  thumbnail: string;
  price: number;
  stock: number;
  category: ProductCategoryResponse;
  // tags: string;
  // images: string;
}

export class CreateProductRequest {
  @ApiProperty({ example: null, required: false })
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
