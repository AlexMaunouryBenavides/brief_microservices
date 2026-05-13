import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { CatalogModule } from './catalog.module';
import { CarEntity } from './infrastructure/database/entities/CarEntity';
import { OptionEntity } from './infrastructure/database/entities/OptionEntity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env['DB_HOST'] ?? 'localhost',
      port: Number(process.env['DB_PORT']) || 3307,
      username: process.env['DB_USER'] ?? 'root',
      password: process.env['DB_PASSWORD'] ?? 'root',
      database: process.env['DB_NAME'] ?? 'catalog_db',
      entities: [CarEntity, OptionEntity],
      synchronize: false,
    }),
    CatalogModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
