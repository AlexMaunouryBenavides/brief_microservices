import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ICartClient } from '../../domain/ports/ICartClient';
import { ICart } from '@brief-ev/shared';

@Injectable()
export class HttpCartClient implements ICartClient {
  constructor(private readonly httpService: HttpService) {}

  async getCart(userId: string): Promise<ICart> {
    const url = `${process.env['CART_SERVICE_URL'] ?? 'http://localhost:3003'}/cart`;
    const response = await firstValueFrom(
      this.httpService.get<ICart>(url, {
        headers: { 'x-user-id': userId },
      }),
    );
    return response.data;
  }
}
