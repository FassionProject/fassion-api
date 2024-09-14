import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductTagService } from './product-tag.service';
import {
  CreateProductTagRequest,
  UpdateProductTagRequest,
} from './product-tag.model';

@Controller('product-tag')
export class ProductTagController {
  constructor(private readonly productTagService: ProductTagService) {}

  @Post()
  create(@Body() createProductTagRequest: CreateProductTagRequest) {
    return this.productTagService.create(createProductTagRequest);
  }

  @Get()
  findAll() {
    return this.productTagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productTagService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductTagRequest: UpdateProductTagRequest,
  ) {
    return this.productTagService.update(+id, updateProductTagRequest);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productTagService.remove(+id);
  }
}
