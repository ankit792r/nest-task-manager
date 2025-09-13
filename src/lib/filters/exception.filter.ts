import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error: string = 'InternalServerError';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') error = res;
      else if (typeof res === 'object' && res !== null)
        error = (res as any).message ?? null;
    } else if (exception instanceof Error) error = exception.message;

    const responseBody = {
      success: false,
      error,
      data: null,
    };

    response.status(status).json(responseBody);
  }
}
