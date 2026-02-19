import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SecurityInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        // Sanitize response data to remove sensitive information
        if (data && typeof data === 'object') {
          // Remove password fields from responses
          if (data.password) {
            delete data.password;
          }

          // If it's an array, sanitize each item
          if (Array.isArray(data)) {
            return data.map(item => {
              if (item && typeof item === 'object' && item.password) {
                const { password, ...sanitized } = item;
                return sanitized;
              }
              return item;
            });
          }
        }

        return data;
      }),
    );
  }
}
