import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProxyService } from '../common/proxy.service';
import { JwtAuthGuard, JwtPayload } from '../auth/jwt-auth.guard';

const CART_SERVICE = process.env['CART_SERVICE_URL'] ?? 'http://localhost:3003';

interface AuthenticatedRequest extends Express.Request {
  user: JwtPayload;
}

@Controller('api/cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly proxy: ProxyService) {}

  @Get()
  async getCart(@Request() req: AuthenticatedRequest): Promise<unknown> {
    return this.proxy.forward('GET', `${CART_SERVICE}/cart`, {
      userId: req.user.sub,
      userRole: req.user.role,
    });
  }

  @Post('items')
  async addItem(
    @Request() req: AuthenticatedRequest,
    @Body() body: unknown,
  ): Promise<unknown> {
    return this.proxy.forward('POST', `${CART_SERVICE}/cart/items`, {
      body,
      userId: req.user.sub,
      userRole: req.user.role,
    });
  }

  @Patch('items/:itemId')
  async updateItem(
    @Request() req: AuthenticatedRequest,
    @Param('itemId') itemId: string,
    @Body() body: unknown,
  ): Promise<unknown> {
    return this.proxy.forward('PATCH', `${CART_SERVICE}/cart/items/${itemId}`, {
      body,
      userId: req.user.sub,
      userRole: req.user.role,
    });
  }

  @Delete('items/:itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeItem(
    @Request() req: AuthenticatedRequest,
    @Param('itemId') itemId: string,
  ): Promise<void> {
    await this.proxy.forward('DELETE', `${CART_SERVICE}/cart/items/${itemId}`, {
      userId: req.user.sub,
      userRole: req.user.role,
    });
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearCart(@Request() req: AuthenticatedRequest): Promise<void> {
    await this.proxy.forward('DELETE', `${CART_SERVICE}/cart`, {
      userId: req.user.sub,
      userRole: req.user.role,
    });
  }
}
