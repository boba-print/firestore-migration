import * as functions from "firebase-functions";
import { Card, User } from "../../interface/database";
import { logger } from "../../logger";
import { cardStreamMigrationService } from "../service/card.service";

export async function cardOnWriteController(
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  context: functions.EventContext
) {
  const { before, after } = change;
  const card = after.data() as Card;
  const cardUid = card.uid;
  // users/{userUid}/cards/{cardUid}
  // card -(parent)-> cardCollection -(parent)-> user
  const userQuerySnap = await after.ref.parent.parent.get();
  const user = userQuerySnap.data() as User;

  logger.debug(
    "Update from... to...",
    {
      before: before.data(),
      after: after.data()
    }
  );

  try {
    await cardStreamMigrationService(cardUid, user.uid);
  }
  catch (err) {
    logger.error(err);
  }
}
