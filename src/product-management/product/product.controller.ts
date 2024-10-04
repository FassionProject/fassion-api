import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  CreateProductRequest,
  ProductEntity,
  ProductGetAllRequest,
  UpdateProductRequest,
} from './product.model';
import { ProductService } from './product.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  ApiCreatedJsonResponse,
  ApiDeletedJsonResponse,
  ApiGetJsonResponse,
  ApiListJsonResponse,
  ApiUpdatedJsonResponse,
} from '../../utils/json-response/json-response.decorator';
import { AuditInfo } from '@src/common/audit/audit.decorator';
import { Audit } from '@src/common/audit/audit.model';
import { ListModel } from '@src/utils/model/list-model.model';
import 'reflect-metadata';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  @ApiCreatedJsonResponse(ProductEntity)
  // @ApiConsumes('multipart/form-data')
  async create(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() product: CreateProductRequest,
    @AuditInfo() audit: Audit,
  ): Promise<ProductEntity> {
    return await this.productService.create(product, audit);
  }

  @Get()
  @ApiListJsonResponse(ProductEntity)
  async findAll(
    @Query() request: ProductGetAllRequest,
  ): Promise<ListModel<ProductEntity>> {
    return await this.productService.findAll(request);
  }

  @Get('seller')
  @ApiListJsonResponse(ProductEntity)
  async findAllBySeller(
    @Query('sellerId') sellerId: string,
    @Query() request: ProductGetAllRequest,
  ): Promise<ListModel<ProductEntity>> {
    return await this.productService.findAll(request);
  }

  @Get(':id')
  @ApiGetJsonResponse(ProductEntity)
  async findOne(@Param('id') id: string): Promise<ProductEntity> {
    return await this.productService.findOne(id);
  }

  @Patch(':id')
  @ApiUpdatedJsonResponse(ProductEntity)
  async update(
    @Param('id') id: string,
    @Body() product: UpdateProductRequest,
    @AuditInfo() audit: Audit,
  ): Promise<ProductEntity> {
    return await this.productService.update(id, product, audit);
  }

  @Delete(':id')
  @ApiDeletedJsonResponse(ProductEntity)
  async remove(
    @Param('id') id: string,
    @AuditInfo() audit: Audit,
  ): Promise<ProductEntity> {
    return await this.productService.remove(id, audit);
  }
}
