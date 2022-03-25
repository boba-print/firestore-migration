import * as functions from "firebase-functions";
import { logger } from "../../logger";
import { kioskMigrationService } from "../service/kiosk.service";

export async function kioskMigrationController(
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  ctx: functions.EventContext
) {
  const { before, after } = change;
  const kiosk = change.after.data();
  const uid = kiosk.uid;

  logger.debug(
    "Update from... to...",
    {
      before: before.data(),
      after: after.data()
    }
  );

  try {
    await kioskMigrationService(uid);
  } catch (err) {
    logger.error(err);
  }
}
