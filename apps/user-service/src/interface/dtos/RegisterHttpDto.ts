import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class RegisterHttpDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/, {
    message:
      'password must contain at least 1 uppercase letter, 1 number, and 1 special character',
  })
  password!: string;

  @IsString()
  @MinLength(1)
  firstName!: string;

  @IsString()
  @MinLength(1)
  lastName!: string;
}
