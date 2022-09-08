import { IsInt } from 'class-validator';

export class UserStorageFirestore {
  @IsInt()
  allocated: number;

  @IsInt()
  used: number;
}