import { userUpdater } from "../updater/user.updater";
import { cardUpdater } from "../updater/card.updater";
import { cardTransactionUpdater } from "../updater/cardTransaction.updater";
import { logger } from "../../logger";

export async function cardTransactionMigrationService(historyUid: string) {
  const history = await cardTransactionUpdater.fetch(historyUid, "cardHistory2");
  if(!history) {
    logger.warn("cardHistory2 is not exists", { historyUid });
    return;
  }

  const { cardUid } = history.paid;
  const { userUid } = history;

  await userUpdater.update(userUid);
  await cardUpdater.update(cardUid, userUid);
  await cardTransactionUpdater.update(historyUid);
}
