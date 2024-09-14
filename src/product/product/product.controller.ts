import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import {
  CreateProductRequest,
  ProductResponse,
  UpdateProductRequest,
} from './product.model';
import { ProductService } from './product.service';
import { ApiTags } from '@nestjs/swagger';
import { response } from 'express';
import { ApiCreatedJsonResponse } from 'src/utils/json-response/json-response.decorator';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiCreatedJsonResponse(ProductResponse)
  create(@Body() product: CreateProductRequest) {
    return this.productService.create(product);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() product: UpdateProductRequest) {
    return this.productService.update(+id, product);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
