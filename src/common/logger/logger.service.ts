import { Injectable, LoggerService as NestLoggerService, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Inject } from '@nestjs/common';
import { Logger } from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  private context?: string;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private configService: ConfigService,
  ) {}

  setContext(context: string): void {
    this.context = context;
  }

  log(message: any, context?: string): void {
    this.logger.info(message, {
      context: context || this.context,
      timestamp: new Date().toISOString(),
    });
  }

  error(message: any, trace?: string, context?: string): void {
    this.logger.error(message, {
      trace,
      context: context || this.context,
      timestamp: new Date().toISOString(),
    });
  }

  warn(message: any, context?: string): void {
    this.logger.warn(message, {
      context: context || this.context,
      timestamp: new Date().toISOString(),
    });
  }

  debug(message: any, context?: string): void {
    this.logger.debug(message, {
      context: context || this.context,
      timestamp: new Date().toISOString(),
    });
  }

  verbose(message: any, context?: string): void {
    this.logger.verbose(message, {
      context: context || this.context,
      timestamp: new Date().toISOString(),
    });
  }

  // Custom methods for structured logging
  logRequest(method: string, url: string, userId?: string, ip?: string): void {
    this.logger.info('HTTP Request', {
      method,
      url,
      userId,
      ip,
      type: 'request',
      timestamp: new Date().toISOString(),
    });
  }

  logResponse(method: string, url: string, statusCode: number, duration: number, userId?: string): void {
    this.logger.info('HTTP Response', {
      method,
      url,
      statusCode,
      duration,
      userId,
      type: 'response',
      timestamp: new Date().toISOString(),
    });
  }

  logError(error: Error, context?: string, userId?: string): void {
    this.logger.error('Application Error', {
      message: error.message,
      stack: error.stack,
      context: context || this.context,
      userId,
      type: 'error',
      timestamp: new Date().toISOString(),
    });
  }

  logBlockchainTransaction(txHash: string, from: string, to: string, value: string, userId?: string): void {
    this.logger.info('Blockchain Transaction', {
      txHash,
      from,
      to,
      value,
      userId,
      type: 'blockchain',
      timestamp: new Date().toISOString(),
    });
  }

  logSecurityEvent(event: string, details: any, userId?: string, ip?: string): void {
    this.logger.warn('Security Event', {
      event,
      details,
      userId,
      ip,
      type: 'security',
      timestamp: new Date().toISOString(),
    });
  }

  logPerformance(operation: string, duration: number, metadata?: any, userId?: string): void {
    this.logger.info('Performance Metric', {
      operation,
      duration,
      metadata,
      userId,
      type: 'performance',
      timestamp: new Date().toISOString(),
    });
  }

  // Helper method to create child logger with context
  child(context: string): LoggerService {
    const childLogger = new LoggerService(this.logger, this.configService);
    childLogger.setContext(context);
    return childLogger;
  }
}
