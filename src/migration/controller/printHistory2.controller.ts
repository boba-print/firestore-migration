import admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { logger } from '../../logger';
import { printHistory2MigrationService } from '../../migration/service/printHistory2.service';

export async function printHistory2MigrationController(
  snap: admin.firestore.DocumentSnapshot,
  ctx: functions.EventContext
) {
  const printHisory = snap.data();
  const uid = printHisory.uid;

  logger.debug('Created new print history', JSON.stringify(snap));

  try {
    await printHistory2MigrationService(uid);
  }
  catch (err) {
    logger.error(err);
  }
}
