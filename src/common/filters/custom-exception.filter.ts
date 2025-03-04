import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const validatorExcep: any = exception;

    const error = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message,
      path: request.url,
      method: request.method,
      // stack: exception.stack,
      validatorExcep: validatorExcep.response?.message,
    };

    response.status(status).json(error);
  }
}
