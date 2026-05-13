import { LoginUserUseCase } from './LoginUserUseCase';
import { RegisterUserUseCase } from '../RegisterUser/RegisterUserUseCase';
import { InMemoryUserRepository } from '../../../__tests__/fakes/InMemoryUserRepository';
import { InvalidCredentialsError } from '../../../domain/errors/UserErrors';

const FAKE_JWT = 'signed.jwt.token';

const fakeJwtService = {
  sign: jest.fn().mockReturnValue(FAKE_JWT),
};

describe('LoginUserUseCase', () => {
  let loginUseCase: LoginUserUseCase;
  let repo: InMemoryUserRepository;

  beforeEach(async () => {
    repo = new InMemoryUserRepository();
    loginUseCase = new LoginUserUseCase(repo, fakeJwtService);

    const register = new RegisterUserUseCase(repo);
    await register.execute({
      email: 'alice@example.com',
      password: 'Secret123!',
      firstName: 'Alice',
      lastName: 'Dupont',
    });

    fakeJwtService.sign.mockClear();
  });

  it('returns accessToken and user on valid credentials', async () => {
    const result = await loginUseCase.execute({
      email: 'alice@example.com',
      password: 'Secret123!',
    });

    expect(result.accessToken).toBe(FAKE_JWT);
    expect(result.user.email).toBe('alice@example.com');
    expect(result.user.role).toBe('customer');
    expect(fakeJwtService.sign).toHaveBeenCalledWith({
      sub: result.user.id,
      email: 'alice@example.com',
      role: 'customer',
    });
  });

  it('throws InvalidCredentialsError when email is unknown', async () => {
    await expect(
      loginUseCase.execute({ email: 'unknown@example.com', password: 'Secret123!' }),
    ).rejects.toThrow(InvalidCredentialsError);
  });

  it('throws InvalidCredentialsError when password is wrong', async () => {
    await expect(
      loginUseCase.execute({ email: 'alice@example.com', password: 'WrongPass!' }),
    ).rejects.toThrow(InvalidCredentialsError);
  });
});
