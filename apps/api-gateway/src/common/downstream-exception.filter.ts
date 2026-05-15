import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { AxiosError } from 'axios';

@Catch(AxiosError)
export class DownstreamExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DownstreamExceptionFilter.name);

  catch(exception: AxiosError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const downstreamStatus = exception.response?.status ?? HttpStatus.BAD_GATEWAY;
    const raw = exception.response?.data as Record<string, unknown> | null | undefined;

    const safeData = {
      message: typeof raw?.['message'] === 'string' ? raw['message'] : 'Service error',
      error: typeof raw?.['error'] === 'string' ? raw['error'] : 'ServiceError',
    };

    this.logger.warn(`Downstream error ${downstreamStatus}: ${safeData.error}`);

    response.status(downstreamStatus).json(safeData);
  }
}
