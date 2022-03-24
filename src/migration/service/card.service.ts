import { cardUpdater } from "../updater/card.updater";
import { userUpdater } from "../updater/user.updater";

export async function cardStreamMigrationService(
  cardUid: string,
  userUid: string
) {
  await userUpdater.update(userUid);
  await cardUpdater.update(cardUid, userUid);
}
