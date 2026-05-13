import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProxyService } from '../common/proxy.service';
import { JwtAuthGuard, JwtPayload } from '../auth/jwt-auth.guard';

const USER_SERVICE = process.env['USER_SERVICE_URL'] ?? 'http://localhost:3001';

interface AuthenticatedRequest extends Express.Request {
  user: JwtPayload;
}

@Controller('api')
export class UserController {
  constructor(private readonly proxy: ProxyService) {}

  @Post('auth/register')
  async register(@Body() body: unknown): Promise<unknown> {
    return this.proxy.forward('POST', `${USER_SERVICE}/auth/register`, { body });
  }

  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: unknown): Promise<unknown> {
    return this.proxy.forward('POST', `${USER_SERVICE}/auth/login`, { body });
  }

  @Get('users/me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: AuthenticatedRequest): Promise<unknown> {
    return this.proxy.forward('GET', `${USER_SERVICE}/users/me`, {
      userId: req.user.sub,
      userRole: req.user.role,
    });
  }

  @Patch('users/me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() body: unknown,
  ): Promise<unknown> {
    return this.proxy.forward('PATCH', `${USER_SERVICE}/users/me`, {
      body,
      userId: req.user.sub,
      userRole: req.user.role,
    });
  }
}
