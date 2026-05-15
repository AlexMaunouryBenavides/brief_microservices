import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { DownstreamExceptionFilter } from './common/downstream-exception.filter';
import { validateEnv } from './common/validate-env';

async function bootstrap(): Promise<void> {
  validateEnv();

  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.enableCors({
    origin: process.env['CORS_ORIGIN'] ?? 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.useGlobalFilters(new DownstreamExceptionFilter());

  const logger = new Logger('Bootstrap');
  const port = Number(process.env['PORT']) || 3000;
  await app.listen(port);
  logger.log(`API Gateway running on port ${port}`);
}

void bootstrap();
