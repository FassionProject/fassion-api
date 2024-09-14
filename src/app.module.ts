import { Module } from '@nestjs/common';
import { ProductModule } from './product/product/product.module';
import { ProductCategoryModule } from './product/product-category/product-category.module';
import { ProductTagModule } from './product/product-tag/product-tag.module';
import { CommonModule } from './common/common.module';
@Module({
  imports: [
    ProductModule,
    ProductCategoryModule,
    ProductTagModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
