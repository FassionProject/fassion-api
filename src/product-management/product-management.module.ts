import { Module } from '@nestjs/common';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { ProductCategoryController } from './product-category/product-category.controller';
import { ProductTagController } from './product-tag/product-tag.controller';
import { ProductCategoryService } from './product-category/product-category.service';
import { ProductTagService } from './product-tag/product-tag.service';
import { ProductImageController } from './product-image/product-image.controller';
import { ProductImageService } from './product-image/product-image.service';
import { ProductReviewController } from './product-review/product-review.controller';
import { ProductReviewService } from './product-review/product-review.service';

@Module({
  controllers: [
    ProductController,
    ProductCategoryController,
    ProductTagController,
    ProductImageController,
    ProductReviewController,
  ],
  providers: [
    ProductService,
    ProductCategoryService,
    ProductTagService,
    ProductImageService,
    ProductReviewService,
  ],
})
export class ProductManagementModule {}
