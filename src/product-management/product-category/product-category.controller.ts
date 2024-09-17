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
import { ProductCategoryService } from './product-category.service';
import {
  CreateProductCategoryRequest,
  ProductCategoryEntity,
  ProductCategoryGetAllRequest,
  UpdateProductCategoryRequest,
} from './product-category.model';
import { Audit } from '../../common/audit/audit.model';
import { AuditInfo } from '../../common/audit/audit.decorator';
import { ApiTags } from '@nestjs/swagger';
import { ApiCreatedJsonResponse } from '../../utils/json-response/json-response.decorator';

@ApiTags('ProductCategory')
@Controller('ProductCategory')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Post()
  @ApiCreatedJsonResponse(ProductCategoryEntity)
  async create(
    @Body() request: CreateProductCategoryRequest,
    @AuditInfo() audit: Audit,
  ): Promise<any> {
    return await this.productCategoryService.create(request, audit);
  }

  @Get()
  findAll(@Query() request: ProductCategoryGetAllRequest) {
    return this.productCategoryService.findAll(request);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // return Utils.SelectProperties(ProductCategoryEntity);
    return this.productCategoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() request: UpdateProductCategoryRequest,
    @AuditInfo() audit: Audit,
  ) {
    return this.productCategoryService.update(id, request, audit);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @AuditInfo() audit: Audit) {
    return this.productCategoryService.remove(id, audit);
  }
}
