import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  CreateProductRequest,
  ProductResponse,
  UpdateProductRequest,
} from './product.model';
import { ProductService } from './product.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { response } from 'express';
import {
  ResponseFormatter,
  OkResponse,
} from 'src/lib/response-formatter/response-formatter';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: OkResponse<CreateProductRequest>,
  })
  create(@Body() product: CreateProductRequest) {
    return response.json(this.productService.create(product));
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
