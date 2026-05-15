import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { CartEntity } from './entities/CartEntity';
import { CartItemEntity } from './entities/CartItemEntity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env['DB_HOST'] ?? 'localhost',
  port: Number(process.env['DB_PORT']) || 3308,
  username: process.env['DB_USER'] ?? 'root',
  password: process.env['DB_PASSWORD'] ?? '1234',
  database: process.env['DB_NAME'] ?? 'cart_db',
  entities: [CartEntity, CartItemEntity],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: false,
});
