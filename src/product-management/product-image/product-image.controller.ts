import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductImageService } from './product-image.service';
import {
  CreateProductImageRequest,
  ProductImageEntity,
  ProductImageGetAllRequest,
  UpdateProductImageRequest,
} from './product-image.model';
import { AuditInfo } from '../../common/audit/audit.decorator';
import { Audit } from '../../common/audit/audit.model';
import { ApiCreatedJsonResponse } from '@src/utils/json-response/json-response.decorator';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ListModel } from '@src/utils/model/list-model.model';

@ApiTags('ProductImage')
@Controller('product-image')
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  @Post()
  @ApiCreatedJsonResponse(ListModel<ProductImageEntity>)
  @UseInterceptors(FilesInterceptor('images'))
  @ApiConsumes('multipart/form-data')
  async create(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() request: CreateProductImageRequest,
    @AuditInfo() audit: Audit,
  ): Promise<ListModel<ProductImageEntity>> {
    return await this.productImageService.create(request, images, audit);
  }

  @Get()
  findAll(@Query() request: ProductImageGetAllRequest) {
    return this.productImageService.findAll(request);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productImageService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @AuditInfo() audit: Audit) {
    return this.productImageService.remove(id, audit);
  }
}
