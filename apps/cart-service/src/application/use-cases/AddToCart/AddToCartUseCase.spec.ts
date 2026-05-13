import { AddToCartUseCase } from './AddToCartUseCase';
import { InMemoryCartRepository } from '../../../__tests__/fakes/InMemoryCartRepository';
import { FakeCatalogClient } from '../../../__tests__/fakes/FakeCatalogClient';
import { TESLA_PRICED, RENAULT_PRICED } from '../../../__tests__/fixtures/cart.fixtures';
import { Cart } from '../../../domain/entities/Cart';

describe('AddToCartUseCase', () => {
  let useCase: AddToCartUseCase;
  let repo: InMemoryCartRepository;
  let catalogClient: FakeCatalogClient;

  beforeEach(() => {
    repo = new InMemoryCartRepository();
    catalogClient = new FakeCatalogClient();
    useCase = new AddToCartUseCase(repo, catalogClient);
    catalogClient.stubResponse('car-1', TESLA_PRICED);
    catalogClient.stubResponse('car-2', RENAULT_PRICED);
  });

  it('creates a cart and adds the first item with snapshot and price', async () => {
    const cart = await useCase.execute({
      userId: 'user-1',
      carId: 'car-1',
      optionIds: ['opt-1'],
      quantity: 1,
    });

    expect(cart).toBeInstanceOf(Cart);
    expect(cart.items).toHaveLength(1);

    const item = cart.items[0];
    expect(item.carId).toBe('car-1');
    expect(item.totalPrice).toBe(45000);
    expect(item.quantity).toBe(1);
    expect(item.carSnapshot.brand).toBe('Tesla');
    expect(item.selectedOptions).toHaveLength(1);
    expect(item.selectedOptions[0].name).toBe('Autopilot');
    expect(item.id).toBeTruthy();
  });

  it('persists the cart in the repository', async () => {
    await useCase.execute({ userId: 'user-1', carId: 'car-1', optionIds: [], quantity: 1 });
    const saved = await repo.findByUserId('user-1');
    expect(saved).not.toBeNull();
    expect(saved?.items).toHaveLength(1);
  });

  it('stores a frozen snapshot immune to catalog changes', async () => {
    const cart = await useCase.execute({ userId: 'user-1', carId: 'car-1', optionIds: ['opt-1'], quantity: 1 });
    catalogClient.stubResponse('car-1', { ...TESLA_PRICED, totalPrice: 99999 });

    const saved = await repo.findByUserId('user-1');
    expect(saved?.items[0].totalPrice).toBe(45000);
    expect(cart.items[0].totalPrice).toBe(45000);
  });

  it('adds multiple items to an existing cart', async () => {
    await useCase.execute({ userId: 'user-1', carId: 'car-1', optionIds: [], quantity: 1 });
    const cart = await useCase.execute({ userId: 'user-1', carId: 'car-2', optionIds: [], quantity: 1 });

    expect(cart.items).toHaveLength(2);
  });

  it('supports quantity > 1', async () => {
    const cart = await useCase.execute({ userId: 'user-1', carId: 'car-1', optionIds: [], quantity: 2 });
    expect(cart.items[0].quantity).toBe(2);
  });
});
