import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { CarEntity } from './entities/CarEntity';
import { OptionEntity } from './entities/OptionEntity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env['DB_HOST'] ?? 'localhost',
  port: Number(process.env['DB_PORT']) || 3307,
  username: process.env['DB_USER'] ?? 'root',
  password: process.env['DB_PASSWORD'] ?? 'root',
  database: process.env['DB_NAME'] ?? 'catalog_db',
  entities: [CarEntity, OptionEntity],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: false,
});
