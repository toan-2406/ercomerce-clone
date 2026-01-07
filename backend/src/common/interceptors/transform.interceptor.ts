import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  meta?: any;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // Only flatten if it's a paginated response (has both items and meta)
        const isPaginated = data && typeof data === 'object' && 'items' in data && 'meta' in data;

        return {
          success: true,
          data: isPaginated ? data.items : data,
          meta: data?.meta || undefined,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
