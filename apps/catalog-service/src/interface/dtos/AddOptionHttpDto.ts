import { IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class AddOptionHttpDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  additionalPrice!: number;
}
