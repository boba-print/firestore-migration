import * as functions from "firebase-functions";
import { User } from "../../interface/database";
import { logger } from "../../logger";
import { userStreamMigrationService } from "../service/user.service";

export async function userOnWriteController(
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  context: functions.EventContext
) {
  const user = change.after.data() as User;
  const userUid = user.uid;

  logger.debug(
    "Update from... to...",
    change.before.data(),
    change.after.data()
  );

  try {
    await userStreamMigrationService(userUid);
  }
  catch (err) {
    logger.error(err);
  }
}
