import * as functions from "firebase-functions";
import { logger } from "../../logger";
import { kioskMigrationService } from "../service/kiosk.service";

export async function kioskMigrationController(
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  ctx: functions.EventContext
) {
  const kiosk = change.after.data();
  const uid = kiosk.uid;

  logger.debug(
    "Update from... to...",
    change.before.data(),
    change.after.data()
  );

  try {
    await kioskMigrationService(uid);
  } catch (err) {
    logger.error(err);
  }
}
