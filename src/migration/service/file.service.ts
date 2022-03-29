import { userUpdater } from "../updater/user.updater";
import { fileUpdater } from "../updater/file.updater";
import { logger } from "../../logger";

export async function fileMigrationService(fileUid: string) {
  const file = await fileUpdater.fetch(fileUid, 'files');
  if(!file) {
    logger.warn("File to update not exists", { fileUid });
  }

  await userUpdater.update(file.userUid);
  await fileUpdater.update(file.uid);
}