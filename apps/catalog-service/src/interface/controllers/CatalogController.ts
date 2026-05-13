import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ListCarsUseCase } from '../../application/use-cases/ListCars/ListCarsUseCase';
import { GetCarByIdUseCase } from '../../application/use-cases/GetCarById/GetCarByIdUseCase';
import { CalculatePriceUseCase, PriceResult } from '../../application/use-cases/CalculatePrice/CalculatePriceUseCase';
import { CreateCarUseCase } from '../../application/use-cases/CreateCar/CreateCarUseCase';
import { UpdateCarUseCase } from '../../application/use-cases/UpdateCar/UpdateCarUseCase';
import { DeleteCarUseCase } from '../../application/use-cases/DeleteCar/DeleteCarUseCase';
import { AddOptionUseCase } from '../../application/use-cases/AddOption/AddOptionUseCase';
import { UpdateOptionUseCase } from '../../application/use-cases/UpdateOption/UpdateOptionUseCase';
import { DeleteOptionUseCase } from '../../application/use-cases/DeleteOption/DeleteOptionUseCase';
import { CreateCarHttpDto } from '../dtos/CreateCarHttpDto';
import { UpdateCarHttpDto } from '../dtos/UpdateCarHttpDto';
import { AddOptionHttpDto } from '../dtos/AddOptionHttpDto';
import { UpdateOptionHttpDto } from '../dtos/UpdateOptionHttpDto';
import { Car } from '../../domain/entities/Car';
import { Option } from '../../domain/entities/Option';

@Controller('cars')
export class CatalogController {
  constructor(
    private readonly listCarsUC: ListCarsUseCase,
    private readonly getCarByIdUC: GetCarByIdUseCase,
    private readonly calculatePriceUC: CalculatePriceUseCase,
    private readonly createCarUC: CreateCarUseCase,
    private readonly updateCarUC: UpdateCarUseCase,
    private readonly deleteCarUC: DeleteCarUseCase,
    private readonly addOptionUC: AddOptionUseCase,
    private readonly updateOptionUC: UpdateOptionUseCase,
    private readonly deleteOptionUC: DeleteOptionUseCase,
  ) {}

  private requireAdmin(role: string | undefined): void {
    if (role !== 'admin') throw new UnauthorizedException('Admin role required');
  }

  @Get()
  async getAll(): Promise<Car[]> {
    return this.listCarsUC.execute();
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Car> {
    return this.getCarByIdUC.execute(id);
  }

  @Get(':id/price')
  async getPrice(
    @Param('id') carId: string,
    @Query('optionIds') optionIds: string | undefined,
  ): Promise<PriceResult> {
    const ids = optionIds ? optionIds.split(',').filter(Boolean) : [];
    return this.calculatePriceUC.execute({ carId, optionIds: ids });
  }

  @Post()
  async create(
    @Headers('x-user-role') role: string,
    @Body() dto: CreateCarHttpDto,
  ): Promise<Car> {
    this.requireAdmin(role);
    return this.createCarUC.execute(dto);
  }

  @Put(':id')
  async update(
    @Headers('x-user-role') role: string,
    @Param('id') id: string,
    @Body() dto: UpdateCarHttpDto,
  ): Promise<Car> {
    this.requireAdmin(role);
    return this.updateCarUC.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Headers('x-user-role') role: string,
    @Param('id') id: string,
  ): Promise<void> {
    this.requireAdmin(role);
    await this.deleteCarUC.execute(id);
  }

  @Post(':id/options')
  async addOption(
    @Headers('x-user-role') role: string,
    @Param('id') carId: string,
    @Body() dto: AddOptionHttpDto,
  ): Promise<Option> {
    this.requireAdmin(role);
    return this.addOptionUC.execute({ carId, ...dto });
  }

  @Put(':id/options/:optionId')
  async updateOption(
    @Headers('x-user-role') role: string,
    @Param('id') carId: string,
    @Param('optionId') optionId: string,
    @Body() dto: UpdateOptionHttpDto,
  ): Promise<Option> {
    this.requireAdmin(role);
    return this.updateOptionUC.execute(carId, optionId, dto);
  }

  @Delete(':id/options/:optionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOption(
    @Headers('x-user-role') role: string,
    @Param('id') carId: string,
    @Param('optionId') optionId: string,
  ): Promise<void> {
    this.requireAdmin(role);
    await this.deleteOptionUC.execute(carId, optionId);
  }
}
