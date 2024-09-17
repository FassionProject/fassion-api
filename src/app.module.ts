import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ProductManagementModule } from './product-management/product-management.module';
@Module({
  imports: [CommonModule, ProductManagementModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
