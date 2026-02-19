import { Module, Global, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StructuredLoggerService } from './logger.service';
import { LoggingMiddleware } from './logging.middleware';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [StructuredLoggerService],
  exports: [StructuredLoggerService],
})
export class LoggingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
