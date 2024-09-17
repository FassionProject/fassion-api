import { Module } from '@nestjs/common';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { ProductCategoryController } from './product-category/product-category.controller';
import { ProductTagController } from './product-tag/product-tag.controller';
import { ProductCategoryService } from './product-category/product-category.service';
import { ProductTagService } from './product-tag/product-tag.service';

@Module({
  controllers: [
    ProductController,
    ProductCategoryController,
    ProductTagController,
  ],
  providers: [ProductService, ProductCategoryService, ProductTagService],
})
export class ProductManagementModule {}
