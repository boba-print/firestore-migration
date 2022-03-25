import admin from "firebase-admin";
import * as functions from "firebase-functions";
import { PrintHistory2 } from "../../interface/database";
import { logger } from "../../logger";
import { printHistory2MigrationService } from "../../migration/service/printHistory2.service";
import { printJobService } from "../service/printJob.service";

export async function printHistory2MigrationController(
  snap: admin.firestore.DocumentSnapshot,
  ctx: functions.EventContext
) {
  const printHistory = snap.data() as PrintHistory2;
  const uid = printHistory.uid;

  logger.debug("Created new print history", JSON.stringify(snap));

  try {
    await printHistory2MigrationService(uid);
  } catch (err) {
    logger.error(err);
  } finally {
    await printJobService.deleteRemainJobWhenPrintHistoryCreated(printHistory);
  }
}
