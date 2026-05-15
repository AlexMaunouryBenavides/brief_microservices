import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RegisterHttpDto } from './RegisterHttpDto';

function buildDto(password: string): RegisterHttpDto {
  return plainToInstance(RegisterHttpDto, {
    email: 'test@example.com',
    password,
    firstName: 'Alice',
    lastName: 'Dupont',
  });
}

describe('RegisterHttpDto — password policy', () => {
  it('rejects a password with no uppercase letter', async () => {
    const errors = await validate(buildDto('password1!'));
    const pwdErrors = errors.filter((e) => e.property === 'password');
    expect(pwdErrors.length).toBeGreaterThan(0);
  });

  it('rejects a password with no number', async () => {
    const errors = await validate(buildDto('Password!!'));
    const pwdErrors = errors.filter((e) => e.property === 'password');
    expect(pwdErrors.length).toBeGreaterThan(0);
  });

  it('rejects a password with no special character', async () => {
    const errors = await validate(buildDto('Password1'));
    const pwdErrors = errors.filter((e) => e.property === 'password');
    expect(pwdErrors.length).toBeGreaterThan(0);
  });

  it('rejects a password shorter than 8 characters', async () => {
    const errors = await validate(buildDto('Ab1!'));
    const pwdErrors = errors.filter((e) => e.property === 'password');
    expect(pwdErrors.length).toBeGreaterThan(0);
  });

  it('accepts a valid password (8+ chars, uppercase, number, special char)', async () => {
    const errors = await validate(buildDto('Str0ng!P'));
    const pwdErrors = errors.filter((e) => e.property === 'password');
    expect(pwdErrors).toHaveLength(0);
  });

  it('accepts a longer complex password', async () => {
    const errors = await validate(buildDto('MySecure#Pass1'));
    const pwdErrors = errors.filter((e) => e.property === 'password');
    expect(pwdErrors).toHaveLength(0);
  });
});
