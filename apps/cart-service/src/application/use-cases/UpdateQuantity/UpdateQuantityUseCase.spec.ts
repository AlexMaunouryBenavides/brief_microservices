import { UpdateQuantityUseCase } from './UpdateQuantityUseCase';
import { InMemoryCartRepository } from '../../../__tests__/fakes/InMemoryCartRepository';
import { FakeCatalogClient } from '../../../__tests__/fakes/FakeCatalogClient';
import { AddToCartUseCase } from '../AddToCart/AddToCartUseCase';
import { TESLA_PRICED } from '../../../__tests__/fixtures/cart.fixtures';
import { CartItemNotFoundError } from '../../../domain/errors/CartErrors';

describe('UpdateQuantityUseCase', () => {
  let useCase: UpdateQuantityUseCase;
  let repo: InMemoryCartRepository;
  let itemId: string;

  beforeEach(async () => {
    repo = new InMemoryCartRepository();
    useCase = new UpdateQuantityUseCase(repo);

    const catalogClient = new FakeCatalogClient();
    catalogClient.stubResponse('car-1', TESLA_PRICED);
    const addUC = new AddToCartUseCase(repo, catalogClient);
    const cart = await addUC.execute({ userId: 'user-1', carId: 'car-1', optionIds: [], quantity: 1 });
    itemId = cart.items[0].id;
  });

  it('updates the item quantity', async () => {
    const cart = await useCase.execute('user-1', itemId, 3);
    expect(cart.items[0].quantity).toBe(3);
  });

  it('persists the new quantity', async () => {
    await useCase.execute('user-1', itemId, 5);
    const saved = await repo.findByUserId('user-1');
    expect(saved?.items[0].quantity).toBe(5);
  });

  it('throws CartItemNotFoundError for unknown itemId', async () => {
    await expect(useCase.execute('user-1', 'unknown', 2)).rejects.toThrow(CartItemNotFoundError);
  });
});
