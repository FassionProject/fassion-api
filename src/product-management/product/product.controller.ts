import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  applyDecorators,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import {
  CreateProductRequest,
  ProductEntity,
  ProductGetAllRequest,
  UpdateProductRequest,
} from './product.model';
import { ProductService } from './product.service';
import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { response } from 'express';
import { ApiCreatedJsonResponse } from '../../utils/json-response/json-response.decorator';
import { AuditInfo } from '@src/common/audit/audit.decorator';
import { Audit } from '@src/common/audit/audit.model';
import { ListModel } from '@src/utils/model/list-model.model';
import 'reflect-metadata';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

export function ApiQueriesFromRequest() {
  const decorators = [];
  const requestInstance = new ProductGetAllRequest();
  const keys = Object.keys(requestInstance);

  console.info('keys', keys);

  keys.forEach((key) => {
    const metadata = Reflect.getMetadata(
      'swagger/apiModelPropertiesArray',
      ProductGetAllRequest.prototype,
      key,
    );
    console.info('metadata', metadata);
    if (metadata) {
      console.info('key', key);
      decorators.push(
        ApiQuery({
          name: key,
          type: metadata.type,
          required: metadata.required,
        }),
      );
    }
  });

  return applyDecorators(...decorators);
}

@ApiTags('Product')
@Controller('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  @ApiCreatedJsonResponse(ProductEntity)
  @ApiConsumes('multipart/form-data')
  async create(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() product: CreateProductRequest,
    @AuditInfo() audit: Audit,
  ): Promise<any> {
    return await this.productService.create(product, audit);
  }

  @Get()
  @ApiQueriesFromRequest()
  async findAll(
    @Query() request: ProductGetAllRequest,
  ): Promise<ListModel<ProductEntity>> {
    return await this.productService.findAll(request);
  }

  @Get('seller')
  async findAllBySeller(
    @Query('sellerId') sellerId: string,
    @Query() request: ProductGetAllRequest,
  ): Promise<ListModel<ProductEntity>> {
    return await this.productService.findAll(request);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductEntity> {
    return await this.productService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() product: UpdateProductRequest,
    @AuditInfo() audit: Audit,
  ): Promise<ProductEntity> {
    return await this.productService.update(id, product, audit);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @AuditInfo() audit: Audit,
  ): Promise<ProductEntity> {
    return await this.productService.remove(id, audit);
  }
}
