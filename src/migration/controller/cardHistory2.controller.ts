import * as functions from "firebase-functions";
import { logger } from "../../logger";
import { cardTransactionMigrationService } from "../service/cardTransaction.service";

export async function cardHistory2OnWriteController(
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  ctx: functions.EventContext
) {
  if (!change.after.exists) {
    return;
  }

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

import { EventContext } from "firebase-functions";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { cardTransactionUpdater } from "../updater/cardTransaction.updater";
export async function cardHistory2OnDeleteController(
  snap: any,
  ctx: EventContext
) {
  const id = snap.id;
  await cardTransactionUpdater.setDeletedOrIgnoreWhenNotExist(id);
}
