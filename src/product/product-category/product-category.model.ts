import { ProductResponse } from 'src/product/product/product.model';

export class ProductCategoryResponse {
  id: string;
  description: string;
  products: ProductResponse[];
}

export class CreateProductCategoryRequest {
  description: string;
}

export class UpdateProductCategoryRequest {
  description: string;
}
