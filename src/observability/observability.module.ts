import { Module, OnModuleInit } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { WinstonModule } from 'nest-winston';
import { LoggerService } from '../common/logger/logger.service';
import { LoggingInterceptor } from '../common/logger/logging.interceptor';
import { MetricsInterceptor } from './metrics.interceptor';
import { TracingService } from './tracing.service';

@Module({
  imports: [
    PrometheusModule.register(),
    WinstonModule.forRoot({
      // Winston config for centralized logging
      transports: [
        // Add transports for console, file, or remote log aggregation
      ],
    }),
  ],
  providers: [
    LoggerService,
    TracingService,
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: MetricsInterceptor },
  ],
  exports: [LoggerService, TracingService],
})
export class ObservabilityModule implements OnModuleInit {
  constructor(private readonly tracingService: TracingService) {}
  onModuleInit() {
    this.tracingService.init();
  }
}
