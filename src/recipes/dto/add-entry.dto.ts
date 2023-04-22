import { IsNumber, IsString } from 'class-validator';

export class AddEntryDto {
  @IsString()
  recipeId: string;

  @IsString()
  unitId: string;

  @IsString()
  itemId: string;

  @IsNumber()
  amount: number;
}
