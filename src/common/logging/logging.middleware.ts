import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { withCorrelationId } from './correlation-id';

/**
 * Middleware to generate and manage correlation IDs for request tracking
 * Assigns a unique correlation ID to every incoming request
 */
@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const correlationId = (req.headers['x-correlation-id'] as string) || uuidv4();
    res.setHeader('x-correlation-id', correlationId);

    withCorrelationId(() => {
      next();
    }, correlationId);
  }
}
