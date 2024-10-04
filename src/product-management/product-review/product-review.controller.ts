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
import { ProductReviewService } from './product-review.service';
import {
  CreateProductReviewRequest,
  ProductReviewEntity,
  ProductReviewGetAllRequest,
  UpdateProductReviewRequest,
} from './product-review.model';
import { Audit } from '../../common/audit/audit.model';
import { AuditInfo } from '../../common/audit/audit.decorator';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiCreatedJsonResponse,
  ApiDeletedJsonResponse,
  ApiGetJsonResponse,
  ApiListJsonResponse,
  ApiUpdatedJsonResponse,
} from '../../utils/json-response/json-response.decorator';

@ApiTags('ProductReview')
@Controller('product-review')
export class ProductReviewController {
  constructor(private readonly productReviewService: ProductReviewService) {}

  @Post()
  @ApiCreatedJsonResponse(ProductReviewEntity)
  async create(
    @Body() request: CreateProductReviewRequest,
    @AuditInfo() audit: Audit,
  ): Promise<ProductReviewEntity> {
    return await this.productReviewService.create(request, audit);
  }

  @Get()
  @ApiListJsonResponse(ProductReviewEntity)
  findAll(@Query() request: ProductReviewGetAllRequest) {
    return this.productReviewService.findAll(request);
  }

  @Get(':id')
  @ApiGetJsonResponse(ProductReviewEntity)
  findOne(@Param('id') id: string) {
    return this.productReviewService.findOne(id);
  }

  @Patch(':id')
  @ApiUpdatedJsonResponse(ProductReviewEntity)
  update(
    @Param('id') id: string,
    @Body() request: UpdateProductReviewRequest,
    @AuditInfo() audit: Audit,
  ) {
    return this.productReviewService.update(id, request, audit);
  }

  @Delete(':id')
  @ApiDeletedJsonResponse(ProductReviewEntity)
  remove(@Param('id') id: string, @AuditInfo() audit: Audit) {
    return this.productReviewService.remove(id, audit);
  }
}
