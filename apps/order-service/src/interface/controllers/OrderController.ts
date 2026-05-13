import {
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CreateOrderUseCase } from '../../application/use-cases/CreateOrder/CreateOrderUseCase';
import { GetUserOrdersUseCase } from '../../application/use-cases/GetUserOrders/GetUserOrdersUseCase';
import { GetOrderByIdUseCase } from '../../application/use-cases/GetOrderById/GetOrderByIdUseCase';
import { Order, OrderItem, OrderStatus } from '../../domain/entities/Order';

interface OrderItemResponse {
  id: string;
  carId: string;
  carSnapshot: { brand: string; model: string; basePrice: number };
  selectedOptions: { id: string; name: string; additionalPrice: number }[];
  unitPrice: number;
  quantity: number;
}

interface OrderResponse {
  id: string;
  userId: string;
  items: OrderItemResponse[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
}

@Controller('orders')
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getUserOrdersUseCase: GetUserOrdersUseCase,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Headers('x-user-id') userId: string): Promise<OrderResponse> {
    const order = await this.createOrderUseCase.execute({ userId });
    return this.toResponse(order);
  }

  @Get()
  async getUserOrders(@Headers('x-user-id') userId: string): Promise<OrderResponse[]> {
    const orders = await this.getUserOrdersUseCase.execute(userId);
    return orders.map((o) => this.toResponse(o));
  }

  @Get(':id')
  async getOrderById(
    @Headers('x-user-id') userId: string,
    @Param('id') orderId: string,
  ): Promise<OrderResponse> {
    const order = await this.getOrderByIdUseCase.execute({ orderId, userId });
    return this.toResponse(order);
  }

  private toResponse(order: Order): OrderResponse {
    return {
      id: order.id,
      userId: order.userId,
      items: order.items.map((item: OrderItem) => ({
        id: item.id,
        carId: item.carId,
        carSnapshot: item.carSnapshot,
        selectedOptions: item.selectedOptions,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
      })),
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
    };
  }
}
