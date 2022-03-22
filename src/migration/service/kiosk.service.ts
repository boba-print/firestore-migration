import { kioskUpdater } from "../updater/kiosk.updater";

export async function kioskMigrationService(kioskUid: string) {
  await kioskUpdater.update(kioskUid);
}
