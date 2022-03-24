import { userUpdater } from "../updater/user.updater";

export async function userStreamMigrationService(userUid: string) {
  await userUpdater.update(userUid);
}