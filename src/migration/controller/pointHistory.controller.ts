import * as functions from "firebase-functions";
import { logger } from "../../logger";
import { pointTransactionMigrationService } from "../service/pointTransaction.service";

export async function pointMigrationController(
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  ctx: functions.EventContext
) {
  const { before, after } = change;
  if (!after.exists) {
    return;
  }

  const pointHistory = after.data();
  const { uid } = pointHistory;

  logger.debug("Update from... to...", {
    before: before.data(),
    after: after.data(),
  });

  try {
    await pointTransactionMigrationService(uid);
  } catch (err) {
    logger.error(err);
  }
}

import { EventContext } from "firebase-functions";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { pointTransactionUpdater } from "../updater/pointTransaction.updater";
export async function pointHistoryOnDeleteController(
  snap: any,
  ctx: EventContext
) {
  const id = snap.id;
  await pointTransactionUpdater.setDeletedOrIgnoreWhenNotExist(id);
}
