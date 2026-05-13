import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DownstreamExceptionFilter } from './common/downstream-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new DownstreamExceptionFilter());
  const logger = new Logger('Bootstrap');
  const port = Number(process.env['PORT']) || 3000;
  await app.listen(port);
  logger.log(`API Gateway running on port ${port}`);
}

void bootstrap();
