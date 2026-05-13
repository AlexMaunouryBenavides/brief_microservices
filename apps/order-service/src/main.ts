import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const port = Number(process.env.PORT) || 3004;
  await app.listen(port);
  logger.log(`Order Service running on port ${port}`);
}

void bootstrap();
