import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductTagService } from './product-tag.service';
import {
  CreateProductTagRequest,
  ProductTagEntity,
  ProductTagGetAllRequest,
  UpdateProductTagRequest,
} from './product-tag.model';
import { AuditInfo } from '../../common/audit/audit.decorator';
import { Audit } from '../../common/audit/audit.model';
import { ApiCreatedJsonResponse } from '@src/utils/json-response/json-response.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ProductTag')
@Controller('ProductTag')
export class ProductTagController {
  constructor(private readonly productTagService: ProductTagService) {}

  @Post()
  @ApiCreatedJsonResponse(ProductTagEntity)
  async create(
    @Body() productCategpry: CreateProductTagRequest,
    @AuditInfo() audit: Audit,
  ): Promise<any> {
    return await this.productTagService.create(productCategpry, audit);
  }

  @Get()
  findAll(@Query() request: ProductTagGetAllRequest) {
    return this.productTagService.findAll(request);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productTagService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() productCategpry: UpdateProductTagRequest,
    @AuditInfo() audit: Audit,
  ) {
    return this.productTagService.update(id, productCategpry, audit);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @AuditInfo() audit: Audit) {
    return this.productTagService.remove(id, audit);
  }
}
