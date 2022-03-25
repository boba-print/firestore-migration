import { pointTransactionUpdater} from "../updater/pointTransaction.updater";
import { userUpdater } from "../updater/user.updater";

export async function pointTransactionMigrationService(pointTransactionUid: string) {
  
  const pointHistory = await pointTransactionUpdater.fetch(pointTransactionUid, 'pointHistory');

  await userUpdater.update(pointHistory.userUid);
  await pointTransactionUpdater.update(pointTransactionUid);
}