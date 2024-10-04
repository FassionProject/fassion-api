import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { JsonResponse } from './json-response';

@Injectable()
export class JsonResponseInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((data) => {
        if (data instanceof StreamableFile) {
          return data;
        }

        if (data instanceof Object) {
          data = Object.keys(data).length ? data : null;
        }

        return JsonResponse.success({
          data: data,
        });
      }),
      tap(() => {
        response.status(200);
      }),
    );
  }
}
