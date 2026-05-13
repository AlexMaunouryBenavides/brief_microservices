import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { OrderEntity } from './entities/OrderEntity';
import { OrderItemEntity } from './entities/OrderItemEntity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env['DB_HOST'] ?? 'localhost',
  port: Number(process.env['DB_PORT']) || 3309,
  username: process.env['DB_USER'] ?? 'root',
  password: process.env['DB_PASSWORD'] ?? 'root',
  database: process.env['DB_NAME'] ?? 'order_db',
  entities: [OrderEntity, OrderItemEntity],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: false,
});
