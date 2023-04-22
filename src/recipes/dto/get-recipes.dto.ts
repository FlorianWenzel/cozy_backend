import { IsOptional, IsString } from 'class-validator';
export class GetRecipesDto {
  @IsString()
  @IsOptional()
  id?: string;
}
