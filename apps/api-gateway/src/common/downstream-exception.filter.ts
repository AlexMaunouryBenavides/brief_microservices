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
    const downstreamData = exception.response?.data as Record<string, unknown> | undefined;

    this.logger.warn(
      `Downstream error ${downstreamStatus}: ${JSON.stringify(downstreamData)}`,
    );

    response.status(downstreamStatus).json(
      downstreamData ?? { message: 'Downstream service error', error: 'BadGateway' },
    );
  }
}
