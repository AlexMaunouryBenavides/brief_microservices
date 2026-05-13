import { CreateOrderUseCase } from './CreateOrderUseCase';
import { InMemoryOrderRepository } from '../../../__tests__/fakes/InMemoryOrderRepository';
import { FakeCartClient } from '../../../__tests__/fakes/FakeCartClient';
import { FakeOrderEventsPublisher } from '../../../__tests__/fakes/FakeOrderEventsPublisher';
import { CartEmptyError } from '../../../domain/errors/OrderErrors';
import { Order } from '../../../domain/entities/Order';
import { ICart } from '@brief-ev/shared';

const makeCart = (userId: string, overrides: Partial<ICart> = {}): ICart => ({
  userId,
  items: [
    {
      id: 'ci-1',
      carId: 'car-1',
      carSnapshot: { brand: 'Tesla', model: 'Model 3', basePrice: 40000 },
      selectedOptions: [{ id: 'opt-1', name: 'Autopilot', additionalPrice: 5000 }],
      totalPrice: 45000,
      quantity: 1,
    },
  ],
  updatedAt: new Date(),
  ...overrides,
});

describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCase;
  let orderRepo: InMemoryOrderRepository;
  let cartClient: FakeCartClient;
  let eventsPublisher: FakeOrderEventsPublisher;

  beforeEach(() => {
    orderRepo = new InMemoryOrderRepository();
    cartClient = new FakeCartClient();
    eventsPublisher = new FakeOrderEventsPublisher();
    useCase = new CreateOrderUseCase(orderRepo, cartClient, eventsPublisher);
  });

  it('creates an order from the user cart', async () => {
    cartClient.setCart('user-1', makeCart('user-1'));

    const order = await useCase.execute({ userId: 'user-1' });

    expect(order).toBeInstanceOf(Order);
    expect(order.userId).toBe('user-1');
    expect(order.items).toHaveLength(1);
    expect(order.items[0].carId).toBe('car-1');
    expect(order.items[0].unitPrice).toBe(45000);
    expect(order.items[0].quantity).toBe(1);
    expect(order.totalAmount).toBe(45000);
    expect(order.status).toBe('pending');
    expect(order.id).toBeTruthy();
    expect(order.createdAt).toBeInstanceOf(Date);
  });

  it('persists the order in the repository', async () => {
    cartClient.setCart('user-1', makeCart('user-1'));

    const order = await useCase.execute({ userId: 'user-1' });

    const saved = await orderRepo.findById(order.id);
    expect(saved).not.toBeNull();
    expect(saved?.userId).toBe('user-1');
  });

  it('calculates total amount correctly for multiple items and quantities', async () => {
    cartClient.setCart('user-2', {
      userId: 'user-2',
      items: [
        {
          id: 'ci-1',
          carId: 'car-1',
          carSnapshot: { brand: 'Tesla', model: 'Model 3', basePrice: 40000 },
          selectedOptions: [],
          totalPrice: 40000,
          quantity: 2,
        },
        {
          id: 'ci-2',
          carId: 'car-2',
          carSnapshot: { brand: 'BMW', model: 'iX', basePrice: 70000 },
          selectedOptions: [],
          totalPrice: 70000,
          quantity: 1,
        },
      ],
      updatedAt: new Date(),
    });

    const order = await useCase.execute({ userId: 'user-2' });

    expect(order.totalAmount).toBe(40000 * 2 + 70000 * 1);
  });

  it('throws CartEmptyError when cart is empty', async () => {
    cartClient.setCart('user-empty', { userId: 'user-empty', items: [], updatedAt: new Date() });

    await expect(useCase.execute({ userId: 'user-empty' })).rejects.toThrow(CartEmptyError);
  });

  it('publishes order.created event after successful creation', async () => {
    cartClient.setCart('user-3', makeCart('user-3'));

    const order = await useCase.execute({ userId: 'user-3' });

    expect(eventsPublisher.publishedEvents).toHaveLength(1);
    expect(eventsPublisher.publishedEvents[0]).toEqual({
      orderId: order.id,
      userId: 'user-3',
      totalAmount: 45000,
    });
  });

  it('does not publish event when cart is empty', async () => {
    cartClient.setCart('user-empty', { userId: 'user-empty', items: [], updatedAt: new Date() });

    await expect(useCase.execute({ userId: 'user-empty' })).rejects.toThrow(CartEmptyError);
    expect(eventsPublisher.publishedEvents).toHaveLength(0);
  });
});
