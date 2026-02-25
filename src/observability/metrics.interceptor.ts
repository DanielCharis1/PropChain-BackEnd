import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Histogram, Counter, Registry } from 'prom-client';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  private readonly httpRequestDuration: Histogram<string>;
  private readonly httpRequestCount: Counter<string>;

  constructor() {
    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status'],
      buckets: [0.05, 0.1, 0.2, 0.5, 1, 2, 5],
    });
    this.httpRequestCount = new Counter({
      name: 'http_request_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status'],
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const route = req.route?.path || req.url;
    const start = process.hrtime();

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        const status = res.statusCode;
        const duration = process.hrtime(start);
        const seconds = duration[0] + duration[1] / 1e9;
        this.httpRequestDuration.labels(method, route, status).observe(seconds);
        this.httpRequestCount.labels(method, route, status).inc();
      }),
    );
  }
}
