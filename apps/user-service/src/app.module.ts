import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UserModule } from './user.module';
import { UserEntity } from './infrastructure/database/entities/UserEntity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env['DB_HOST'] ?? 'localhost',
      port: Number(process.env['DB_PORT']) || 3306,
      username: process.env['DB_USER'] ?? 'root',
      password: process.env['DB_PASSWORD'] ?? 'root',
      database: process.env['DB_NAME'] ?? 'user_db',
      entities: [UserEntity],
      synchronize: process.env['DB_SYNCHRONIZE'] === 'true',
    }),
    UserModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
