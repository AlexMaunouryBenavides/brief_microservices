import { RegisterUserUseCase } from './RegisterUserUseCase';
import { InMemoryUserRepository } from '../../../__tests__/fakes/InMemoryUserRepository';
import { EmailAlreadyTakenError } from '../../../domain/errors/UserErrors';
import { User } from '../../../domain/entities/User';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let repo: InMemoryUserRepository;

  beforeEach(() => {
    repo = new InMemoryUserRepository();
    useCase = new RegisterUserUseCase(repo);
  });

  it('creates a user with hashed password and customer role', async () => {
    const user = await useCase.execute({
      email: 'alice@example.com',
      password: 'Secret123!',
      firstName: 'Alice',
      lastName: 'Dupont',
    });

    expect(user).toBeInstanceOf(User);
    expect(user.email).toBe('alice@example.com');
    expect(user.firstName).toBe('Alice');
    expect(user.lastName).toBe('Dupont');
    expect(user.role).toBe('customer');
    expect(user.passwordHash).not.toBe('Secret123!');
    expect(user.passwordHash.length).toBeGreaterThan(0);
    expect(user.id).toBeTruthy();
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it('persists the user in the repository', async () => {
    await useCase.execute({
      email: 'bob@example.com',
      password: 'Pass456!',
      firstName: 'Bob',
      lastName: 'Martin',
    });

    const saved = await repo.findByEmail('bob@example.com');
    expect(saved).not.toBeNull();
    expect(saved?.firstName).toBe('Bob');
  });

  it('throws EmailAlreadyTakenError when email is taken', async () => {
    await useCase.execute({
      email: 'taken@example.com',
      password: 'Pass456!',
      firstName: 'First',
      lastName: 'User',
    });

    await expect(
      useCase.execute({
        email: 'taken@example.com',
        password: 'Other789!',
        firstName: 'Second',
        lastName: 'User',
      }),
    ).rejects.toThrow(EmailAlreadyTakenError);
  });
});
