import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { OrderModule } from './order.module';
import { OrderEntity } from './infrastructure/database/entities/OrderEntity';
import { OrderItemEntity } from './infrastructure/database/entities/OrderItemEntity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env['DB_HOST'] ?? 'localhost',
      port: Number(process.env['DB_PORT']) || 3309,
      username: process.env['DB_USER'] ?? 'root',
      password: process.env['DB_PASSWORD'] ?? 'root',
      database: process.env['DB_NAME'] ?? 'order_db',
      entities: [OrderEntity, OrderItemEntity],
      synchronize: process.env['DB_SYNCHRONIZE'] === 'true',
    }),
    OrderModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
