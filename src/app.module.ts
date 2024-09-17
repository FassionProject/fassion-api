import { Module } from '@nestjs/common';
import { ProductModule } from './product-management/product/product.module';
import { ProductCategoryModule } from './product-management/product-category/product-category.module';
import { ProductTagModule } from './product-management/product-tag/product-tag.module';
import { CommonModule } from './common/common.module';
@Module({
  imports: [
    CommonModule,
    ProductModule,
    ProductCategoryModule,
    ProductTagModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
