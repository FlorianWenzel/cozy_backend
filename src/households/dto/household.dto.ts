import { IsNotEmpty, IsString } from 'class-validator';

export class HouseholdDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
