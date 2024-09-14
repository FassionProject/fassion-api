import { Injectable } from '@nestjs/common';
import {
  CreateProductRequest,
  ProductResponse,
  UpdateProductRequest,
} from './product.model';

@Injectable()
export class ProductService {
  create(product: CreateProductRequest) {
    return new ProductResponse();
  }

  findAll() {
    return [{}];
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, product: UpdateProductRequest) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
