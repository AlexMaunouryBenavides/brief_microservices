import { ICatalogClient, PricedCart } from '../../domain/ports/ICatalogClient';

export class FakeCatalogClient implements ICatalogClient {
  private responses: Map<string, PricedCart> = new Map();

  stubResponse(carId: string, response: PricedCart): void {
    this.responses.set(carId, response);
  }

  async getCarWithPrice(carId: string, _optionIds: string[]): Promise<PricedCart> {
    const response = this.responses.get(carId);
    if (!response) throw new Error(`FakeCatalogClient: no stub for carId=${carId}`);
    return response;
  }
}
