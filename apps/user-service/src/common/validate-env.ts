export function validateEnv(): void {
  const jwtSecret = process.env['JWT_SECRET'];
  if (!jwtSecret || jwtSecret === 'changeme') {
    throw new Error('JWT_SECRET must be set to a strong, non-default value');
  }
}
