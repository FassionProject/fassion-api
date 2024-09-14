import { ProductResponse } from 'src/product/product/product.model';

export class ProductTagResponse {
  id: string;
  storeId: string;
  description: string;
  products: ProductResponse[];
}

export class CreateProductTagRequest {
  description: string;
}

export class UpdateProductTagRequest {
  description: string;
}
