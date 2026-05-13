import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProxyService } from '../common/proxy.service';
import { JwtAuthGuard, JwtPayload } from '../auth/jwt-auth.guard';

const ORDER_SERVICE = process.env['ORDER_SERVICE_URL'] ?? 'http://localhost:3004';

interface AuthenticatedRequest extends Express.Request {
  user: JwtPayload;
}

@Controller('api/orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly proxy: ProxyService) {}

  @Post()
  async createOrder(@Request() req: AuthenticatedRequest): Promise<unknown> {
    return this.proxy.forward('POST', `${ORDER_SERVICE}/orders`, {
      body: {},
      userId: req.user.sub,
      userRole: req.user.role,
    });
  }

  @Get()
  async listOrders(@Request() req: AuthenticatedRequest): Promise<unknown> {
    return this.proxy.forward('GET', `${ORDER_SERVICE}/orders`, {
      userId: req.user.sub,
      userRole: req.user.role,
    });
  }

  @Get(':id')
  async getOrder(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<unknown> {
    return this.proxy.forward('GET', `${ORDER_SERVICE}/orders/${id}`, {
      userId: req.user.sub,
      userRole: req.user.role,
    });
  }
}
