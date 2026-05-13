import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import {
  CartEmptyError,
  OrderNotFoundError,
  UnauthorizedOrderAccessError,
} from '../../domain/errors/OrderErrors';

@Catch(CartEmptyError, OrderNotFoundError, UnauthorizedOrderAccessError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof CartEmptyError) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
    } else if (exception instanceof OrderNotFoundError) {
      status = HttpStatus.NOT_FOUND;
    } else if (exception instanceof UnauthorizedOrderAccessError) {
      status = HttpStatus.FORBIDDEN;
    }

    response.status(status).json({ message: exception.message, error: exception.name });
  }
}
