import { GetProfileUseCase } from './GetProfileUseCase';
import { InMemoryUserRepository } from '../../../__tests__/fakes/InMemoryUserRepository';
import { RegisterUserUseCase } from '../RegisterUser/RegisterUserUseCase';
import { UserNotFoundError } from '../../../domain/errors/UserErrors';

describe('GetProfileUseCase', () => {
  let useCase: GetProfileUseCase;
  let repo: InMemoryUserRepository;
  let userId: string;

  beforeEach(async () => {
    repo = new InMemoryUserRepository();
    useCase = new GetProfileUseCase(repo);

    const register = new RegisterUserUseCase(repo);
    const user = await register.execute({
      email: 'alice@example.com',
      password: 'Secret123!',
      firstName: 'Alice',
      lastName: 'Dupont',
    });
    userId = user.id;
  });

  it('returns the user profile for a valid id', async () => {
    const user = await useCase.execute(userId);
    expect(user.id).toBe(userId);
    expect(user.email).toBe('alice@example.com');
  });

  it('throws UserNotFoundError for unknown id', async () => {
    await expect(useCase.execute('nonexistent-id')).rejects.toThrow(UserNotFoundError);
  });
});
