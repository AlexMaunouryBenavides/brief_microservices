import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  CarNotFoundError,
  OptionNotFoundError,
  OptionNotBelongToCarError,
} from '../../domain/errors/CatalogErrors';

@Catch(CarNotFoundError, OptionNotFoundError, OptionNotBelongToCarError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof CarNotFoundError || exception instanceof OptionNotFoundError) {
      status = HttpStatus.NOT_FOUND;
    } else if (exception instanceof OptionNotBelongToCarError) {
      status = HttpStatus.BAD_REQUEST;
    }

    response.status(status).json({ message: exception.message, error: exception.name });
  }
}
