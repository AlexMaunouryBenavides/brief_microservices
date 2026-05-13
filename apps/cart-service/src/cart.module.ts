import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from './infrastructure/database/entities/CartEntity';
import { CartItemEntity } from './infrastructure/database/entities/CartItemEntity';
import { TypeOrmCartRepository } from './infrastructure/database/repositories/TypeOrmCartRepository';
import { CatalogHttpClient } from './infrastructure/http/CatalogHttpClient';
import { CartEventsConsumer } from './infrastructure/messaging/CartEventsConsumer';
import { GetCartUseCase } from './application/use-cases/GetCart/GetCartUseCase';
import { AddToCartUseCase } from './application/use-cases/AddToCart/AddToCartUseCase';
import { RemoveFromCartUseCase } from './application/use-cases/RemoveFromCart/RemoveFromCartUseCase';
import { UpdateQuantityUseCase } from './application/use-cases/UpdateQuantity/UpdateQuantityUseCase';
import { ClearCartUseCase } from './application/use-cases/ClearCart/ClearCartUseCase';
import { CartController } from './interface/controllers/CartController';
import { HttpService } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity, CartItemEntity]), HttpModule],
  controllers: [CartController],
  providers: [
    {
      provide: TypeOrmCartRepository,
      useFactory: (repo: Repository<CartEntity>): TypeOrmCartRepository =>
        new TypeOrmCartRepository(repo),
      inject: [getRepositoryToken(CartEntity)],
    },
    {
      provide: CatalogHttpClient,
      useFactory: (http: HttpService): CatalogHttpClient => new CatalogHttpClient(http),
      inject: [HttpService],
    },
    {
      provide: GetCartUseCase,
      useFactory: (repo: TypeOrmCartRepository): GetCartUseCase => new GetCartUseCase(repo),
      inject: [TypeOrmCartRepository],
    },
    {
      provide: AddToCartUseCase,
      useFactory: (
        repo: TypeOrmCartRepository,
        catalog: CatalogHttpClient,
      ): AddToCartUseCase => new AddToCartUseCase(repo, catalog),
      inject: [TypeOrmCartRepository, CatalogHttpClient],
    },
    {
      provide: RemoveFromCartUseCase,
      useFactory: (repo: TypeOrmCartRepository): RemoveFromCartUseCase =>
        new RemoveFromCartUseCase(repo),
      inject: [TypeOrmCartRepository],
    },
    {
      provide: UpdateQuantityUseCase,
      useFactory: (repo: TypeOrmCartRepository): UpdateQuantityUseCase =>
        new UpdateQuantityUseCase(repo),
      inject: [TypeOrmCartRepository],
    },
    {
      provide: ClearCartUseCase,
      useFactory: (repo: TypeOrmCartRepository): ClearCartUseCase =>
        new ClearCartUseCase(repo),
      inject: [TypeOrmCartRepository],
    },
    {
      provide: CartEventsConsumer,
      useFactory: (clearCart: ClearCartUseCase): CartEventsConsumer =>
        new CartEventsConsumer(clearCart),
      inject: [ClearCartUseCase],
    },
  ],
})
export class CartModule {}
