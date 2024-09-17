import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { JsonResponse } from '../../utils/json-response/json-response';
import { ZodError } from 'zod';
import {
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Catch(
  ZodError,
  HttpException,
  PrismaClientUnknownRequestError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientValidationError,
)
export class ErrorFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception instanceof ZodError) {
      response.status(200).json(
        JsonResponse.error({
          errors: exception.flatten().fieldErrors,
          message: 'Validation Error',
          status: 422,
        }),
      );
    } else if (exception instanceof HttpException) {
      response.status(200).json(
        JsonResponse.error({
          errors: exception.getResponse(),
          message: exception.message,
          status: exception.getStatus(),
        }),
      );
    } else {
      response.status(200).json(
        JsonResponse.error({
          errors: exception,
          message: 'API Internal Server Error',
          status: 500,
        }),
      );
    }
  }
}
