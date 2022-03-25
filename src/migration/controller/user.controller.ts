import * as functions from "firebase-functions";
import { User } from "../../interface/database";
import { logger } from "../../logger";
import { userStreamMigrationService } from "../service/user.service";

export async function userOnWriteController(
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  context: functions.EventContext
) {
  const { before, after } = change;

  logger.debug("Update from... to...", {
    before: before.data(),
    after: after.data(),
  });

  let userUid: string;
  if (before.exists) {
    userUid = before.data().uid;
  }
  if (after.exists) {
    userUid = after.data().uid;
  }

  if (userUid) {
    try {
      await userStreamMigrationService(userUid);
    } catch (err) {
      logger.error(err);
    }
  }
}
