import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRecipeDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  id: string;

  @IsNumber()
  rating: number;

  @IsString()
  householdId: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsArray()
  @IsOptional()
  recipeEntries: any;
}
