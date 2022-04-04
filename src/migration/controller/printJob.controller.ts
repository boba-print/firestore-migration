import * as functions from "firebase-functions";
import { PrintJob } from "../../interface/database";
import { printJobUpdater } from "../updater/printJob.updater";

export function printJobOnWriteController(
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  ctx: functions.EventContext
) {
  const { before, after } = change;
  if (!after.exists) {
    return;
  }
  
  let printJob: PrintJob | null = null;
  if (before.exists) {
    printJob = before.data() as PrintJob;
  }
  if (after.exists) {
    printJob = after.data() as PrintJob;
  }

  if (!printJob) {
    throw new Error("Document to update not exists");
  }

  const { uid, kioskJobUid } = printJob;
  printJobUpdater.update(uid, kioskJobUid);
}

import { EventContext } from "firebase-functions";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export async function printJobOnDeleteController(snap: any, ctx: EventContext) {
  const id = snap.id;
  await printJobUpdater.setDeletedOrIgnoreWhenNotExist(id);
}
