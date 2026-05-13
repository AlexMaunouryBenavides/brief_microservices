import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { UserEntity } from './entities/UserEntity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env['DB_HOST'] ?? 'localhost',
  port: Number(process.env['DB_PORT']) || 3306,
  username: process.env['DB_USER'] ?? 'root',
  password: process.env['DB_PASSWORD'] ?? 'root',
  database: process.env['DB_NAME'] ?? 'user_db',
  entities: [UserEntity],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: false,
});
