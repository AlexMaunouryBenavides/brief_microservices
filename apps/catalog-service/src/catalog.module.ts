import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarEntity } from './infrastructure/database/entities/CarEntity';
import { OptionEntity } from './infrastructure/database/entities/OptionEntity';
import { TypeOrmCarRepository } from './infrastructure/database/repositories/TypeOrmCarRepository';
import { TypeOrmOptionRepository } from './infrastructure/database/repositories/TypeOrmOptionRepository';
import { ListCarsUseCase } from './application/use-cases/ListCars/ListCarsUseCase';
import { GetCarByIdUseCase } from './application/use-cases/GetCarById/GetCarByIdUseCase';
import { CalculatePriceUseCase } from './application/use-cases/CalculatePrice/CalculatePriceUseCase';
import { CreateCarUseCase } from './application/use-cases/CreateCar/CreateCarUseCase';
import { UpdateCarUseCase } from './application/use-cases/UpdateCar/UpdateCarUseCase';
import { DeleteCarUseCase } from './application/use-cases/DeleteCar/DeleteCarUseCase';
import { AddOptionUseCase } from './application/use-cases/AddOption/AddOptionUseCase';
import { UpdateOptionUseCase } from './application/use-cases/UpdateOption/UpdateOptionUseCase';
import { DeleteOptionUseCase } from './application/use-cases/DeleteOption/DeleteOptionUseCase';
import { CatalogController } from './interface/controllers/CatalogController';

@Module({
  imports: [TypeOrmModule.forFeature([CarEntity, OptionEntity])],
  controllers: [CatalogController],
  providers: [
    {
      provide: TypeOrmCarRepository,
      useFactory: (repo: Repository<CarEntity>): TypeOrmCarRepository =>
        new TypeOrmCarRepository(repo),
      inject: [getRepositoryToken(CarEntity)],
    },
    {
      provide: TypeOrmOptionRepository,
      useFactory: (repo: Repository<OptionEntity>): TypeOrmOptionRepository =>
        new TypeOrmOptionRepository(repo),
      inject: [getRepositoryToken(OptionEntity)],
    },
    {
      provide: ListCarsUseCase,
      useFactory: (repo: TypeOrmCarRepository): ListCarsUseCase => new ListCarsUseCase(repo),
      inject: [TypeOrmCarRepository],
    },
    {
      provide: GetCarByIdUseCase,
      useFactory: (repo: TypeOrmCarRepository): GetCarByIdUseCase => new GetCarByIdUseCase(repo),
      inject: [TypeOrmCarRepository],
    },
    {
      provide: CalculatePriceUseCase,
      useFactory: (repo: TypeOrmCarRepository): CalculatePriceUseCase =>
        new CalculatePriceUseCase(repo),
      inject: [TypeOrmCarRepository],
    },
    {
      provide: CreateCarUseCase,
      useFactory: (repo: TypeOrmCarRepository): CreateCarUseCase => new CreateCarUseCase(repo),
      inject: [TypeOrmCarRepository],
    },
    {
      provide: UpdateCarUseCase,
      useFactory: (repo: TypeOrmCarRepository): UpdateCarUseCase => new UpdateCarUseCase(repo),
      inject: [TypeOrmCarRepository],
    },
    {
      provide: DeleteCarUseCase,
      useFactory: (repo: TypeOrmCarRepository): DeleteCarUseCase => new DeleteCarUseCase(repo),
      inject: [TypeOrmCarRepository],
    },
    {
      provide: AddOptionUseCase,
      useFactory: (
        carRepo: TypeOrmCarRepository,
        optionRepo: TypeOrmOptionRepository,
      ): AddOptionUseCase => new AddOptionUseCase(carRepo, optionRepo),
      inject: [TypeOrmCarRepository, TypeOrmOptionRepository],
    },
    {
      provide: UpdateOptionUseCase,
      useFactory: (
        carRepo: TypeOrmCarRepository,
        optionRepo: TypeOrmOptionRepository,
      ): UpdateOptionUseCase => new UpdateOptionUseCase(carRepo, optionRepo),
      inject: [TypeOrmCarRepository, TypeOrmOptionRepository],
    },
    {
      provide: DeleteOptionUseCase,
      useFactory: (
        carRepo: TypeOrmCarRepository,
        optionRepo: TypeOrmOptionRepository,
      ): DeleteOptionUseCase => new DeleteOptionUseCase(carRepo, optionRepo),
      inject: [TypeOrmCarRepository, TypeOrmOptionRepository],
    },
  ],
})
export class CatalogModule {}
