import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  EmailAlreadyTakenError,
  InvalidCredentialsError,
  UserNotFoundError,
} from '../../domain/errors/UserErrors';

@Catch(EmailAlreadyTakenError, UserNotFoundError, InvalidCredentialsError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof EmailAlreadyTakenError) {
      status = HttpStatus.CONFLICT;
    } else if (exception instanceof UserNotFoundError) {
      status = HttpStatus.NOT_FOUND;
    } else if (exception instanceof InvalidCredentialsError) {
      status = HttpStatus.UNAUTHORIZED;
    }

    response.status(status).json({ message: exception.message, error: exception.name });
  }
}
