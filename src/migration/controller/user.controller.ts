import * as functions from "firebase-functions";
import { User } from "../../interface/database";
import { logger } from "../../logger";
import { userStreamMigrationService } from "../service/user.service";

export async function userOnWriteController(
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  context: functions.EventContext
) {
  const { before, after } = change;
  if (!after.exists) {
    return;
  }

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

import { EventContext } from "firebase-functions";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { userUpdater } from "../updater/user.updater";

export async function userOnDeleteController(snap: any, ctx: EventContext) {
  const id = snap.id;
  await userUpdater.setDeletedOrIgnoreWhenNotExist(id);
}
