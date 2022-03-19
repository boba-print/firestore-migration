import admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { printHistory2MigrationService } from '../../migration/service/printHistory2.service';

export async function printHistory2MigrationController(
  snap: admin.firestore.DocumentSnapshot,
  ctx: functions.EventContext
) {
  const printHisory = snap.data();
  const uid = printHisory.uid;

  console.log(JSON.stringify(snap));

  await printHistory2MigrationService(uid);
}
