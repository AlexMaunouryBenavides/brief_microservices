import { GetOrderByIdUseCase } from './GetOrderByIdUseCase';
import { InMemoryOrderRepository } from '../../../__tests__/fakes/InMemoryOrderRepository';
import { Order } from '../../../domain/entities/Order';
import { OrderNotFoundError, UnauthorizedOrderAccessError } from '../../../domain/errors/OrderErrors';

const makeOrder = (id: string, userId: string): Order =>
  new Order({
    id,
    userId,
    items: [],
    totalAmount: 1000,
    status: 'pending',
    createdAt: new Date(),
  });

describe('GetOrderByIdUseCase', () => {
  let useCase: GetOrderByIdUseCase;
  let repo: InMemoryOrderRepository;

  beforeEach(() => {
    repo = new InMemoryOrderRepository();
    useCase = new GetOrderByIdUseCase(repo);
  });

  it('returns the order when it belongs to the requesting user', async () => {
    const order = makeOrder('order-1', 'user-1');
    await repo.save(order);

    const result = await useCase.execute({ orderId: 'order-1', userId: 'user-1' });

    expect(result.id).toBe('order-1');
    expect(result).toBeInstanceOf(Order);
  });

  it('throws OrderNotFoundError when order does not exist', async () => {
    await expect(
      useCase.execute({ orderId: 'non-existent', userId: 'user-1' }),
    ).rejects.toThrow(OrderNotFoundError);
  });

  it('throws UnauthorizedOrderAccessError when order belongs to another user', async () => {
    const order = makeOrder('order-1', 'user-1');
    await repo.save(order);

    await expect(
      useCase.execute({ orderId: 'order-1', userId: 'user-2' }),
    ).rejects.toThrow(UnauthorizedOrderAccessError);
  });
});
