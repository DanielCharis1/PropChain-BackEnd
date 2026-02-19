import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../logger/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let error: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exception.constructor.name;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || exception.message;
        error = (exceptionResponse as any).error || exception.constructor.name;
      } else {
        message = exception.message;
        error = exception.constructor.name;
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      error = 'InternalServerError';
    }

    // Log the error
    this.logError(exception, request, status);

    // Prepare error response
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
      ...(this.configService.get('NODE_ENV') === 'development' && {
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    };

    response.status(status).json(errorResponse);
  }

  private logError(exception: unknown, request: Request, status: number): void {
    const userId = (request as any).user?.id;
    const ip = request.ip || request.connection.remoteAddress;

    if (exception instanceof HttpException) {
      // Log HTTP exceptions as warnings
      this.loggerService.warn(`HTTP Exception: ${exception.message}`, AllExceptionsFilter.name);

      this.loggerService.logSecurityEvent(
        'http_exception',
        {
          message: exception.message,
          status,
          url: request.url,
          method: request.method,
        },
        userId,
        ip,
      );
    } else {
      // Log unexpected errors as errors
      const error = exception instanceof Error ? exception : new Error(String(exception));
      this.loggerService.logError(error, AllExceptionsFilter.name, userId);

      this.loggerService.logSecurityEvent(
        'unhandled_exception',
        {
          message: error.message,
          stack: error.stack,
          url: request.url,
          method: request.method,
        },
        userId,
        ip,
      );
    }
  }
}
