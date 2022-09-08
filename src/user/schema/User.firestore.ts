import { IsBoolean, IsPhoneNumber, IsString, ValidateNested, IsInt } from "class-validator";
import { UserHistoryFirestore } from "./UserHistory.firestore";
import { UserStorageFirestore } from "./UserStorage.firestore";

export class UserFirestore {
  @IsString()
  email: string;

  @ValidateNested()
  history: UserHistoryFirestore;

  @IsBoolean()
  isDisabled: boolean;

  @IsString()
  name: string;

  @IsPhoneNumber()
  phoneNumber: string;

  @IsInt()
  points: number;

  @ValidateNested()
  storage: UserStorageFirestore;

  @IsString()
  uid: string;
}