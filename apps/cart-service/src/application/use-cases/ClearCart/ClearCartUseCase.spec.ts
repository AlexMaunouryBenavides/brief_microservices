import { ClearCartUseCase } from './ClearCartUseCase';
import { InMemoryCartRepository } from '../../../__tests__/fakes/InMemoryCartRepository';
import { FakeCatalogClient } from '../../../__tests__/fakes/FakeCatalogClient';
import { AddToCartUseCase } from '../AddToCart/AddToCartUseCase';
import { TESLA_PRICED } from '../../../__tests__/fixtures/cart.fixtures';

describe('ClearCartUseCase', () => {
  let useCase: ClearCartUseCase;
  let repo: InMemoryCartRepository;

  beforeEach(async () => {
    repo = new InMemoryCartRepository();
    useCase = new ClearCartUseCase(repo);

    const catalogClient = new FakeCatalogClient();
    catalogClient.stubResponse('car-1', TESLA_PRICED);
    const addUC = new AddToCartUseCase(repo, catalogClient);
    await addUC.execute({ userId: 'user-1', carId: 'car-1', optionIds: [], quantity: 1 });
  });

  it('removes all items from the cart', async () => {
    await useCase.execute('user-1');
    const saved = await repo.findByUserId('user-1');
    expect(saved?.items).toHaveLength(0);
  });

  it('is idempotent for a user with no cart', async () => {
    await expect(useCase.execute('user-no-cart')).resolves.not.toThrow();
  });
});
