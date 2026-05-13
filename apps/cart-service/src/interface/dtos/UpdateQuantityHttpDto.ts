import { IsInt, Min } from 'class-validator';

export class UpdateQuantityHttpDto {
  @IsInt()
  @Min(1)
  quantity!: number;
}
