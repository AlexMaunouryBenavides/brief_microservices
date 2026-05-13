import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProxyService } from '../common/proxy.service';
import { JwtAuthGuard, JwtPayload } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

const CATALOG_SERVICE = process.env['CATALOG_SERVICE_URL'] ?? 'http://localhost:3002';

interface AuthenticatedRequest extends Express.Request {
  user: JwtPayload;
}

@Controller('api/catalog/cars')
export class CatalogController {
  constructor(private readonly proxy: ProxyService) {}

  @Get()
  async listCars(): Promise<unknown> {
    return this.proxy.forward('GET', `${CATALOG_SERVICE}/cars`);
  }

  @Get(':id')
  async getCar(@Param('id') id: string): Promise<unknown> {
    return this.proxy.forward('GET', `${CATALOG_SERVICE}/cars/${id}`);
  }

  @Get(':id/price')
  async getPrice(
    @Param('id') id: string,
    @Query('optionIds') optionIds: string | undefined,
  ): Promise<unknown> {
    return this.proxy.forward('GET', `${CATALOG_SERVICE}/cars/${id}/price`, {
      query: optionIds ? { optionIds } : {},
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createCar(
    @Request() req: AuthenticatedRequest,
    @Body() body: unknown,
  ): Promise<unknown> {
    return this.proxy.forward('POST', `${CATALOG_SERVICE}/cars`, {
      body,
      userRole: req.user.role,
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateCar(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<unknown> {
    return this.proxy.forward('PUT', `${CATALOG_SERVICE}/cars/${id}`, {
      body,
      userRole: req.user.role,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteCar(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<void> {
    await this.proxy.forward('DELETE', `${CATALOG_SERVICE}/cars/${id}`, {
      userRole: req.user.role,
    });
  }

  @Post(':id/options')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async addOption(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<unknown> {
    return this.proxy.forward('POST', `${CATALOG_SERVICE}/cars/${id}/options`, {
      body,
      userRole: req.user.role,
    });
  }

  @Put(':id/options/:optionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateOption(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('optionId') optionId: string,
    @Body() body: unknown,
  ): Promise<unknown> {
    return this.proxy.forward('PUT', `${CATALOG_SERVICE}/cars/${id}/options/${optionId}`, {
      body,
      userRole: req.user.role,
    });
  }

  @Delete(':id/options/:optionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteOption(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('optionId') optionId: string,
  ): Promise<void> {
    await this.proxy.forward(
      'DELETE',
      `${CATALOG_SERVICE}/cars/${id}/options/${optionId}`,
      { userRole: req.user.role },
    );
  }
}
