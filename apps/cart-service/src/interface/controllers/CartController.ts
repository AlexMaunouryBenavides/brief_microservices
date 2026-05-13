import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { GetCartUseCase } from '../../application/use-cases/GetCart/GetCartUseCase';
import { AddToCartUseCase } from '../../application/use-cases/AddToCart/AddToCartUseCase';
import { RemoveFromCartUseCase } from '../../application/use-cases/RemoveFromCart/RemoveFromCartUseCase';
import { UpdateQuantityUseCase } from '../../application/use-cases/UpdateQuantity/UpdateQuantityUseCase';
import { ClearCartUseCase } from '../../application/use-cases/ClearCart/ClearCartUseCase';
import { AddToCartHttpDto } from '../dtos/AddToCartHttpDto';
import { UpdateQuantityHttpDto } from '../dtos/UpdateQuantityHttpDto';
import { Cart } from '../../domain/entities/Cart';

@Controller('cart')
export class CartController {
  constructor(
    private readonly getCartUC: GetCartUseCase,
    private readonly addToCartUC: AddToCartUseCase,
    private readonly removeFromCartUC: RemoveFromCartUseCase,
    private readonly updateQuantityUC: UpdateQuantityUseCase,
    private readonly clearCartUC: ClearCartUseCase,
  ) {}

  @Get()
  async getCart(@Headers('x-user-id') userId: string): Promise<Cart> {
    return this.getCartUC.execute(userId);
  }

  @Post('items')
  async addItem(
    @Headers('x-user-id') userId: string,
    @Body() dto: AddToCartHttpDto,
  ): Promise<Cart> {
    return this.addToCartUC.execute({ userId, ...dto });
  }

  @Patch('items/:itemId')
  async updateItem(
    @Headers('x-user-id') userId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateQuantityHttpDto,
  ): Promise<Cart> {
    return this.updateQuantityUC.execute(userId, itemId, dto.quantity);
  }

  @Delete('items/:itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeItem(
    @Headers('x-user-id') userId: string,
    @Param('itemId') itemId: string,
  ): Promise<void> {
    await this.removeFromCartUC.execute(userId, itemId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearCart(@Headers('x-user-id') userId: string): Promise<void> {
    await this.clearCartUC.execute(userId);
  }
}
