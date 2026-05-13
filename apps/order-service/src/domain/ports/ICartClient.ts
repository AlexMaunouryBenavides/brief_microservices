import { ICart } from '@brief-ev/shared';

export interface ICartClient {
  getCart(userId: string): Promise<ICart>;
}
