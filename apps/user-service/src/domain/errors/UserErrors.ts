export class EmailAlreadyTakenError extends Error {
  constructor(email: string) {
    super(`Email already taken: ${email}`);
    this.name = 'EmailAlreadyTakenError';
  }
}

export class UserNotFoundError extends Error {
  constructor(identifier: string) {
    super(`User not found: ${identifier}`);
    this.name = 'UserNotFoundError';
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid credentials');
    this.name = 'InvalidCredentialsError';
  }
}
