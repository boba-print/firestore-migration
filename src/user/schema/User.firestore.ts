import { IsBoolean, IsPhoneNumber, IsString, ValidateNested, IsInt, IsDefined } from "class-validator";
import { UserHistoryFirestore } from "./UserHistory.firestore";
import { UserStorageFirestore } from "./UserStorage.firestore";

export class UserFirestore {
  @IsString()
  @IsDefined()
  email: string;

  @ValidateNested()
  @IsDefined()
  history: UserHistoryFirestore;

  @IsBoolean()
  @IsDefined()
  isDisabled: boolean;

  @IsString()
  @IsDefined()
  name: string;

  @IsPhoneNumber()
  @IsDefined()
  phoneNumber: string;

  @IsInt()
  @IsDefined()
  points: number;

  @ValidateNested()
  @IsDefined()
  storage: UserStorageFirestore;

  @IsString()
  @IsDefined()
  uid: string;
}