import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import {
  CreateProductCategoryRequest,
  UpdateProductCategoryRequest,
} from './product-category.model';

@Controller('product-category')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Post()
  create(@Body() productCategpry: CreateProductCategoryRequest) {
    return this.productCategoryService.create(productCategpry);
  }

  @Get()
  findAll() {
    return this.productCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() productCategpry: UpdateProductCategoryRequest,
  ) {
    return this.productCategoryService.update(+id, productCategpry);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productCategoryService.remove(+id);
  }
}
