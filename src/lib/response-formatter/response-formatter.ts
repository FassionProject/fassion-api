import { HttpStatus } from '@nestjs/common';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import {
  CreateProductRequest,
  ProductResponse,
} from 'src/product/product/product.model';

class APIResponse<T> {
  @ApiProperty({ example: 1 })
  result: number;

  @ApiProperty({ example: HttpStatus.OK })
  status: HttpStatus;

  @ApiProperty({ example: HttpStatus.OK.toLocaleString() })
  message: string;

  @ApiProperty({ example: null })
  error?: object;

  @ApiProperty({ example: {} })
  data?: T;
}

export class OkResponse<T> extends APIResponse<T> {
  @ApiProperty({ example: 1 })
  result: number;
  @ApiProperty({ example: HttpStatus.OK })
  status: HttpStatus;
  @ApiProperty({ example: 'OK' })
  message: string;
}

export class ResponseFormatter {
  constructor() {}
  static format<T>(
    result: number,
    status: HttpStatus,
    message: string,
    error?: object,
    data?: T,
  ): APIResponse<T> {
    return {
      result,
      status,
      message,
      error,
      data,
    };
  }
  static success<T>(
    data: T,
    result: number = 1,
    status: HttpStatus = HttpStatus.OK,
    message: string = HttpStatus.OK.toString(),
  ): APIResponse<T> {
    return {
      result,
      status,
      message,
      data,
    };
  }

  static error(
    error: object,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    message: string = HttpStatus.INTERNAL_SERVER_ERROR.toString(),
  ): APIResponse<null> {
    return {
      result: -1,
      status,
      message,
      error,
    };
  }
}
