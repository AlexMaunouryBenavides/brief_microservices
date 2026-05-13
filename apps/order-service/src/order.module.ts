import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './infrastructure/database/entities/OrderEntity';
import { OrderItemEntity } from './infrastructure/database/entities/OrderItemEntity';
import { TypeOrmOrderRepository } from './infrastructure/database/repositories/TypeOrmOrderRepository';
import { HttpCartClient } from './infrastructure/http/HttpCartClient';
import { OrderEventsPublisher } from './infrastructure/messaging/OrderEventsPublisher';
import { CreateOrderUseCase } from './application/use-cases/CreateOrder/CreateOrderUseCase';
import { GetUserOrdersUseCase } from './application/use-cases/GetUserOrders/GetUserOrdersUseCase';
import { GetOrderByIdUseCase } from './application/use-cases/GetOrderById/GetOrderByIdUseCase';
import { OrderController } from './interface/controllers/OrderController';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderItemEntity]), HttpModule],
  controllers: [OrderController],
  providers: [
    OrderEventsPublisher,
    HttpCartClient,
    {
      provide: TypeOrmOrderRepository,
      useFactory: (repo: Repository<OrderEntity>): TypeOrmOrderRepository =>
        new TypeOrmOrderRepository(repo),
      inject: [getRepositoryToken(OrderEntity)],
    },
    {
      provide: CreateOrderUseCase,
      useFactory: (
        repo: TypeOrmOrderRepository,
        cartClient: HttpCartClient,
        eventsPublisher: OrderEventsPublisher,
      ): CreateOrderUseCase => new CreateOrderUseCase(repo, cartClient, eventsPublisher),
      inject: [TypeOrmOrderRepository, HttpCartClient, OrderEventsPublisher],
    },
    {
      provide: GetUserOrdersUseCase,
      useFactory: (repo: TypeOrmOrderRepository): GetUserOrdersUseCase =>
        new GetUserOrdersUseCase(repo),
      inject: [TypeOrmOrderRepository],
    },
    {
      provide: GetOrderByIdUseCase,
      useFactory: (repo: TypeOrmOrderRepository): GetOrderByIdUseCase =>
        new GetOrderByIdUseCase(repo),
      inject: [TypeOrmOrderRepository],
    },
  ],
})
export class OrderModule {}
