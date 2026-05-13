import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { CartModule } from './cart.module';
import { CartEntity } from './infrastructure/database/entities/CartEntity';
import { CartItemEntity } from './infrastructure/database/entities/CartItemEntity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env['DB_HOST'] ?? 'localhost',
      port: Number(process.env['DB_PORT']) || 3308,
      username: process.env['DB_USER'] ?? 'root',
      password: process.env['DB_PASSWORD'] ?? 'root',
      database: process.env['DB_NAME'] ?? 'cart_db',
      entities: [CartEntity, CartItemEntity],
      synchronize: false,
    }),
    CartModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
