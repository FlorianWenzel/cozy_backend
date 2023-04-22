import { IsString } from 'class-validator';
export class CreateItemDto {
  @IsString()
  name: string;

  @IsString()
  defaultUnitId: string;
}
