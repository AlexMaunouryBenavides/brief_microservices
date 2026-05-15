import { validateEnv } from './validate-env';

describe('validateEnv', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('throws when JWT_SECRET is not set', () => {
    delete process.env['JWT_SECRET'];
    expect(() => validateEnv()).toThrow('JWT_SECRET must be set to a strong, non-default value');
  });

  it('throws when JWT_SECRET equals the default "changeme"', () => {
    process.env['JWT_SECRET'] = 'changeme';
    expect(() => validateEnv()).toThrow('JWT_SECRET must be set to a strong, non-default value');
  });

  it('does not throw when JWT_SECRET is a strong custom value', () => {
    process.env['JWT_SECRET'] = 'a_very_strong_secret_value_abc123!XYZ';
    expect(() => validateEnv()).not.toThrow();
  });
});
