import * as functions from "firebase-functions";
import { File } from "../../interface/database";
import { fileMigrationService } from "../service/file.service";

export async function fileOnWriteController(
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  ctx: functions.EventContext
) {
  const { before, after } = change;
  let file: File | null = null;
  if(before.exists) {
    file = before.data() as File;
  }
  if(after.exists) {
    file = after.data() as File;
  }

  if(!file) {
    throw new Error("Document to update not exists");
  }

  await fileMigrationService(file.uid);
}