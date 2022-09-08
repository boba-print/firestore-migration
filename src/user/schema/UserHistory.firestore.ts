import { ValidateNested } from "class-validator";
import { FirestoreTimestamp } from "./FirestoreTimestamp";

export class UserHistoryFirestore {
  @ValidateNested()
  checkedNoticeAt: FirestoreTimestamp;

  @ValidateNested()
  registeredAt: FirestoreTimestamp;

  @ValidateNested()
  signedInAt: FirestoreTimestamp;
}
