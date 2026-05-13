import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ICatalogClient, PricedCart } from '../../domain/ports/ICatalogClient';
import { CatalogServiceError } from '../../domain/errors/CartErrors';

@Injectable()
export class CatalogHttpClient implements ICatalogClient {
  private readonly logger = new Logger(CatalogHttpClient.name);
  private readonly baseUrl =
    process.env['CATALOG_SERVICE_URL'] ?? 'http://localhost:3002';

  constructor(private readonly http: HttpService) {}

  async getCarWithPrice(carId: string, optionIds: string[]): Promise<PricedCart> {
    try {
      const query = optionIds.length > 0 ? `?optionIds=${optionIds.join(',')}` : '';
      const [carRes, priceRes] = await Promise.all([
        firstValueFrom(this.http.get<{
          id: string; brand: string; model: string; year: number;
          basePrice: number; imageUrl?: string;
        }>(`${this.baseUrl}/cars/${carId}`)),
        firstValueFrom(this.http.get<{
          totalPrice: number; basePrice: number;
          selectedOptions: Array<{ id: string; name: string; additionalPrice: number }>;
        }>(`${this.baseUrl}/cars/${carId}/price${query}`)),
      ]);

      const car = carRes.data;
      const price = priceRes.data;

      return {
        car: {
          carId: car.id,
          brand: car.brand,
          model: car.model,
          year: car.year,
          basePrice: car.basePrice,
          imageUrl: car.imageUrl,
        },
        selectedOptions: price.selectedOptions.map((o) => ({
          optionId: o.id,
          name: o.name,
          additionalPrice: o.additionalPrice,
        })),
        totalPrice: price.totalPrice,
      };
    } catch (err) {
      this.logger.error(`Failed to fetch car ${carId} from catalog-service`, err);
      throw new CatalogServiceError(`Could not fetch car ${carId}`);
    }
  }
}
