import { IsDefined, ValidateNested } from "class-validator";
import { FirestoreTimestamp } from "./FirestoreTimestamp";

export class UserHistoryFirestore {
  @ValidateNested()
  @IsDefined()
  checkedNoticeAt: FirestoreTimestamp;

  @ValidateNested()
  @IsDefined()
  registeredAt: FirestoreTimestamp;

  @ValidateNested()
  @IsDefined()
  signedInAt: FirestoreTimestamp;
}
