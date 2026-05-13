import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './interface/middlewares/DomainExceptionFilter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.useGlobalFilters(new DomainExceptionFilter());
  const logger = new Logger('Bootstrap');
  const port = Number(process.env['PORT']) || 3004;
  await app.listen(port);
  logger.log(`Order Service running on port ${port}`);
}

void bootstrap();
