import * as functions from "firebase-functions";
import { logger } from "../../logger";
import { cardTransactionMigrationService } from "../service/cardTransaction.service";

export async function cardHistory2OnWriteController(
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  ctx: functions.EventContext
) {
  const cardHistory = change.after.data();
  const uid = cardHistory.uid;

  logger.debug("Update from... to...", {
    before: change.before.data(),
    after: change.after.data(),
  });

  try {
    await cardTransactionMigrationService(uid);
  } catch (err) {
    logger.error(err);
  }
}
