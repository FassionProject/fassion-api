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

    let message: string = 'API Internal Server Error';
    let errors: Record<string, any> = {};
    let status: number = 500;

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
          errors: exception,
          message: exception.message,
          status: exception.getStatus(),
        }),
      );
    } else if (exception instanceof PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        message = 'Record already exists';
        for (const [key, value] of Object.entries(exception.meta.target)) {
          errors[value] = `${value} already exists`;
        }
      } else if (exception.code === 'P2003') {
        message = 'Foreign Key Constraint Error';
        for (const [key, value] of Object.entries(exception.meta)) {
          errors[key] = value;
        }
      } else {
        message = exception.name;
        errors = exception.meta;
      }

      response.status(200).json(
        JsonResponse.error({
          errors: errors,
          message: message,
          status: 422,
        }),
      );
    } else {
      response.status(200).json(
        JsonResponse.error({
          errors: exception,
          message: message,
          status: status,
        }),
      );
    }
  }
}
