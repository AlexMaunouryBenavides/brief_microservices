import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { CartItemNotFoundError, CatalogServiceError } from '../../domain/errors/CartErrors';

@Catch(CartItemNotFoundError, CatalogServiceError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof CartItemNotFoundError
        ? HttpStatus.NOT_FOUND
        : HttpStatus.BAD_GATEWAY;

    response.status(status).json({ message: exception.message, error: exception.name });
  }
}
