import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './infrastructure/database/entities/UserEntity';
import { TypeOrmUserRepository } from './infrastructure/database/repositories/TypeOrmUserRepository';
import { UserEventsPublisher } from './infrastructure/messaging/UserEventsPublisher';
import { RegisterUserUseCase } from './application/use-cases/RegisterUser/RegisterUserUseCase';
import { LoginUserUseCase } from './application/use-cases/LoginUser/LoginUserUseCase';
import { GetProfileUseCase } from './application/use-cases/GetProfile/GetProfileUseCase';
import { UpdateProfileUseCase } from './application/use-cases/UpdateProfile/UpdateProfileUseCase';
import { UserController } from './interface/controllers/UserController';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env['JWT_SECRET'] ?? 'changeme',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [UserController],
  providers: [
    UserEventsPublisher,
    {
      provide: TypeOrmUserRepository,
      useFactory: (repo: Repository<UserEntity>): TypeOrmUserRepository =>
        new TypeOrmUserRepository(repo),
      inject: [getRepositoryToken(UserEntity)],
    },
    {
      provide: RegisterUserUseCase,
      useFactory: (repo: TypeOrmUserRepository): RegisterUserUseCase =>
        new RegisterUserUseCase(repo),
      inject: [TypeOrmUserRepository],
    },
    {
      provide: LoginUserUseCase,
      useFactory: (repo: TypeOrmUserRepository, jwt: JwtService): LoginUserUseCase =>
        new LoginUserUseCase(repo, jwt),
      inject: [TypeOrmUserRepository, JwtService],
    },
    {
      provide: GetProfileUseCase,
      useFactory: (repo: TypeOrmUserRepository): GetProfileUseCase =>
        new GetProfileUseCase(repo),
      inject: [TypeOrmUserRepository],
    },
    {
      provide: UpdateProfileUseCase,
      useFactory: (repo: TypeOrmUserRepository): UpdateProfileUseCase =>
        new UpdateProfileUseCase(repo),
      inject: [TypeOrmUserRepository],
    },
  ],
})
export class UserModule {}
