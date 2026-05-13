export type UserRole = 'customer' | 'admin';

export interface UserProps {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
}

export class User {
  readonly id: string;
  readonly email: string;
  readonly passwordHash: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: UserRole;
  readonly createdAt: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.role = props.role;
    this.createdAt = props.createdAt;
  }

  withUpdatedProfile(fields: { firstName?: string; lastName?: string }): User {
    return new User({
      id: this.id,
      email: this.email,
      passwordHash: this.passwordHash,
      firstName: fields.firstName ?? this.firstName,
      lastName: fields.lastName ?? this.lastName,
      role: this.role,
      createdAt: this.createdAt,
    });
  }
}
