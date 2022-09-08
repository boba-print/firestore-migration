import { IsNumber } from "class-validator";

export class FirestoreTimestamp {
  @IsNumber()
  _seconds: number;

  @IsNumber()
  _nanoseconds: number;
}