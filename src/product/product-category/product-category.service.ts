import { Injectable } from '@nestjs/common';
import {
  CreateProductCategoryRequest,
  UpdateProductCategoryRequest,
} from './product-category.model';

@Injectable()
export class ProductCategoryService {
  create(productCategoryRequest: CreateProductCategoryRequest) {
    return 'This action adds a new productCategory';
  }

  findAll() {
    return `This action returns all productCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productCategory`;
  }

  update(id: number, productCategoryRequest: UpdateProductCategoryRequest) {
    return `This action updates a #${id} productCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} productCategory`;
  }
}
