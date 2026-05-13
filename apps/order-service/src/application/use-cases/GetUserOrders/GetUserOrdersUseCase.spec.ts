import { GetUserOrdersUseCase } from './GetUserOrdersUseCase';
import { InMemoryOrderRepository } from '../../../__tests__/fakes/InMemoryOrderRepository';
import { Order } from '../../../domain/entities/Order';

const makeOrder = (userId: string): Order =>
  new Order({
    id: Math.random().toString(36).slice(2),
    userId,
    items: [],
    totalAmount: 1000,
    status: 'pending',
    createdAt: new Date(),
  });

describe('GetUserOrdersUseCase', () => {
  let useCase: GetUserOrdersUseCase;
  let repo: InMemoryOrderRepository;

  beforeEach(() => {
    repo = new InMemoryOrderRepository();
    useCase = new GetUserOrdersUseCase(repo);
  });

  it('returns all orders for a given user', async () => {
    const order1 = makeOrder('user-1');
    const order2 = makeOrder('user-1');
    const order3 = makeOrder('user-2');
    await repo.save(order1);
    await repo.save(order2);
    await repo.save(order3);

    const result = await useCase.execute('user-1');

    expect(result).toHaveLength(2);
    expect(result.every((o) => o.userId === 'user-1')).toBe(true);
  });

  it('returns empty array when user has no orders', async () => {
    const result = await useCase.execute('user-no-orders');

    expect(result).toEqual([]);
  });

  it('returns orders as Order instances', async () => {
    await repo.save(makeOrder('user-1'));

    const result = await useCase.execute('user-1');

    expect(result[0]).toBeInstanceOf(Order);
  });
});
