import * as functions from "firebase-functions";
import { Card, User } from "../../interface/database";
import { logger } from "../../logger";
import { cardStreamMigrationService } from "../service/card.service";

export async function cardOnWriteController(
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  context: functions.EventContext
) {
  const card = change.after.data() as Card;
  const cardUid = card.uid;
  // users/{userUid}/cards/{cardUid}
  // card -(parent)-> cardCollection -(parent)-> user
  const userUid = change.after.ref.parent.parent.id;

  logger.debug(
    "Update from... to...",
    change.before.data(),
    change.after.data()
  );

  try {
    await cardStreamMigrationService(cardUid, userUid);
  }
  catch (err) {
    logger.error(err);
  }
}
