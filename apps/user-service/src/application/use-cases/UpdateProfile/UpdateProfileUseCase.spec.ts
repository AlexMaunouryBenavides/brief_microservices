import { UpdateProfileUseCase } from './UpdateProfileUseCase';
import { InMemoryUserRepository } from '../../../__tests__/fakes/InMemoryUserRepository';
import { RegisterUserUseCase } from '../RegisterUser/RegisterUserUseCase';
import { UserNotFoundError } from '../../../domain/errors/UserErrors';

describe('UpdateProfileUseCase', () => {
  let useCase: UpdateProfileUseCase;
  let repo: InMemoryUserRepository;
  let userId: string;

  beforeEach(async () => {
    repo = new InMemoryUserRepository();
    useCase = new UpdateProfileUseCase(repo);

    const register = new RegisterUserUseCase(repo);
    const user = await register.execute({
      email: 'alice@example.com',
      password: 'Secret123!',
      firstName: 'Alice',
      lastName: 'Dupont',
    });
    userId = user.id;
  });

  it('updates firstName and lastName', async () => {
    const updated = await useCase.execute(userId, {
      firstName: 'Alicia',
      lastName: 'Durand',
    });

    expect(updated.firstName).toBe('Alicia');
    expect(updated.lastName).toBe('Durand');
    expect(updated.email).toBe('alice@example.com');
    expect(updated.id).toBe(userId);
  });

  it('allows partial update (only firstName)', async () => {
    const updated = await useCase.execute(userId, { firstName: 'Alicia' });

    expect(updated.firstName).toBe('Alicia');
    expect(updated.lastName).toBe('Dupont');
  });

  it('persists the update in the repository', async () => {
    await useCase.execute(userId, { firstName: 'Alicia' });

    const fetched = await repo.findById(userId);
    expect(fetched?.firstName).toBe('Alicia');
  });

  it('throws UserNotFoundError for unknown id', async () => {
    await expect(
      useCase.execute('unknown-id', { firstName: 'X' }),
    ).rejects.toThrow(UserNotFoundError);
  });
});
