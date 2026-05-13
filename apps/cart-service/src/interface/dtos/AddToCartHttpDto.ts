import { IsArray, IsInt, IsString, IsUUID, Min } from 'class-validator';

export class AddToCartHttpDto {
  @IsUUID()
  carId!: string;

  @IsArray()
  @IsString({ each: true })
  optionIds!: string[];

  @IsInt()
  @Min(1)
  quantity!: number;
}
