import { GetCartUseCase } from './GetCartUseCase';
import { InMemoryCartRepository } from '../../../__tests__/fakes/InMemoryCartRepository';
import { Cart } from '../../../domain/entities/Cart';

describe('GetCartUseCase', () => {
  let useCase: GetCartUseCase;
  let repo: InMemoryCartRepository;

  beforeEach(() => {
    repo = new InMemoryCartRepository();
    useCase = new GetCartUseCase(repo);
  });

  it('returns an empty cart when user has no cart yet', async () => {
    const cart = await useCase.execute('user-1');
    expect(cart).toBeInstanceOf(Cart);
    expect(cart.userId).toBe('user-1');
    expect(cart.items).toEqual([]);
  });

  it('returns the existing cart when one exists', async () => {
    await repo.save(Cart.empty('user-1'));
    const cart = await useCase.execute('user-1');
    expect(cart.userId).toBe('user-1');
  });
});
