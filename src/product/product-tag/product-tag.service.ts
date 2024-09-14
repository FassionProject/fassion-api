import { Injectable } from '@nestjs/common';
import {
  CreateProductTagRequest,
  UpdateProductTagRequest,
} from './product-tag.model';

@Injectable()
export class ProductTagService {
  create(createProductTagRequest: CreateProductTagRequest) {
    return 'This action adds a new productTag';
  }

  findAll() {
    return `This action returns all productTag`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productTag`;
  }

  update(id: number, updateProductTagRequest: UpdateProductTagRequest) {
    return `This action updates a #${id} productTag`;
  }

  remove(id: number) {
    return `This action removes a #${id} productTag`;
  }
}
