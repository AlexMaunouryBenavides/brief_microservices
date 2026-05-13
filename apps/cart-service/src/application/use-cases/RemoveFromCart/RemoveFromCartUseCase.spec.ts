import { RemoveFromCartUseCase } from './RemoveFromCartUseCase';
import { InMemoryCartRepository } from '../../../__tests__/fakes/InMemoryCartRepository';
import { FakeCatalogClient } from '../../../__tests__/fakes/FakeCatalogClient';
import { AddToCartUseCase } from '../AddToCart/AddToCartUseCase';
import { TESLA_PRICED } from '../../../__tests__/fixtures/cart.fixtures';
import { CartItemNotFoundError } from '../../../domain/errors/CartErrors';

describe('RemoveFromCartUseCase', () => {
  let useCase: RemoveFromCartUseCase;
  let repo: InMemoryCartRepository;
  let itemId: string;

  beforeEach(async () => {
    repo = new InMemoryCartRepository();
    useCase = new RemoveFromCartUseCase(repo);

    const catalogClient = new FakeCatalogClient();
    catalogClient.stubResponse('car-1', TESLA_PRICED);
    const addUC = new AddToCartUseCase(repo, catalogClient);
    const cart = await addUC.execute({ userId: 'user-1', carId: 'car-1', optionIds: [], quantity: 1 });
    itemId = cart.items[0].id;
  });

  it('removes the item from the cart', async () => {
    const cart = await useCase.execute('user-1', itemId);
    expect(cart.items).toHaveLength(0);
  });

  it('persists the removal', async () => {
    await useCase.execute('user-1', itemId);
    const saved = await repo.findByUserId('user-1');
    expect(saved?.items).toHaveLength(0);
  });

  it('throws CartItemNotFoundError for unknown itemId', async () => {
    await expect(useCase.execute('user-1', 'unknown-item')).rejects.toThrow(CartItemNotFoundError);
  });

  it('throws CartItemNotFoundError when user has no cart', async () => {
    await expect(useCase.execute('user-no-cart', 'any-item')).rejects.toThrow(CartItemNotFoundError);
  });
});
