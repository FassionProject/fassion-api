import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HTTPLogInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Log Request (method, url, headers, body)
    console.info(`\nRequest: `, {
      method: request.method,
      url: request.url,
      headers: request.headers,
      body: request.body,
      ip: request.ip,
    });

    return next.handle().pipe(
      tap((data) => {
        // Log Response (status, headers, body)
        const response = context.switchToHttp().getResponse();
        console.info(`\nResponse: `, {
          method: request.method,
          url: request.url,
          status: response.statusCode,
          headers: response.getHeaders(),
          body: data,
        });
      }),
    );
  }
}
