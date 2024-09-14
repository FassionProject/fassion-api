import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { ProductResponse } from 'src/product/product/product.model';

export class ProductCategoryResponse {
  @ApiProperty({ example: randomUUID() })
  id: string;

  @ApiProperty({ example: 'Kaos' })
  description: string;
}

export class ProductCategoryWithProductsResponse extends ProductCategoryResponse {
  @ApiProperty({ type: [ProductResponse] })
  products: ProductResponse[];
}

export class CreateProductCategoryRequest {
  description: string;
}

export class UpdateProductCategoryRequest {
  description: string;
}
