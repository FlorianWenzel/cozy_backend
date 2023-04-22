import { IsNotEmpty, IsString } from 'class-validator';

export class SetUsernameDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}
