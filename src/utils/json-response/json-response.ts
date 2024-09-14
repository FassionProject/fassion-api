import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

const HttpStatusMessage = {
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  204: 'No Content',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
};
export class JsonResponse<T> {
  @ApiProperty({ example: 1 })
  result: number;
  @ApiProperty({ example: HttpStatus.OK })
  status: HttpStatus;
  @ApiProperty({ example: HttpStatusMessage[HttpStatus.OK] })
  message: string;
  @ApiProperty()
  data?: T;

  static format<T>(
    result: number,
    status: HttpStatus,
    message?: string,
    data?: T,
  ): JsonResponse<T> {
    return {
      result,
      status,
      message: message
        ? message
        : HttpStatusMessage[status] || status.toString(),
      data,
    };
  }

  static success<T>(
    data: T,
    result: number = 1,
    status: number = 200,
    message?: string,
  ): JsonResponse<T> {
    return this.format(result, status, message, data);
  }

  static error<T>(
    errors: T,
    status: number = 500,
    message: string = 'Internal Server Error',
  ): JsonResponse<T> {
    return this.format(-1, status, message, errors);
  }
}
