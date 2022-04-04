import * as functions from "firebase-functions";
import {
  cardOnDeleteController,
  cardOnWriteController,
} from "./controller/card.controller";
import {
  cardHistory2OnDeleteController,
  cardHistory2OnWriteController,
} from "./controller/cardHistory2.controller";
import {
  kioskMigrationController,
  kioskOnDeleteController,
} from "./controller/kiosk.controller";
import {
  printHistory2MigrationController,
  printHistory2OnDeleteController,
} from "./controller/printHistory2.controller";
import { printJobOnDeleteController, printJobOnWriteController } from "./controller/printJob.controller";
import {
  userOnDeleteController,
  userOnWriteController,
} from "./controller/user.controller";
import {
  fileOnDeleteController,
  fileOnWriteController,
} from "./controller/file.controller";

const firestoreFunctionsBuilder = functions
  .runWith({
    vpcConnector: "fb-functions-access",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  })
  .region("asia-northeast1").firestore;

const PRINT_HISTORY2_PATH = "printHistory2/{uid}";
const printHistory2OnWrite = firestoreFunctionsBuilder
  .document(PRINT_HISTORY2_PATH)
  .onCreate(printHistory2MigrationController);
const printHistory2OnDelete = firestoreFunctionsBuilder
  .document(PRINT_HISTORY2_PATH)
  .onDelete(printHistory2OnDeleteController);

const KIOSK_PATH = "kiosks/{uid}";
const kioskOnWrite = firestoreFunctionsBuilder
  .document(KIOSK_PATH)
  .onWrite(kioskMigrationController);
const kioskOnDelete = firestoreFunctionsBuilder
  .document(KIOSK_PATH)
  .onDelete(kioskOnDeleteController);

const USER_PATH = "users/{uid}";
const userOnWrite = firestoreFunctionsBuilder
  .document(USER_PATH)
  .onWrite(userOnWriteController);
const userOnDelete = firestoreFunctionsBuilder
  .document(USER_PATH)
  .onDelete(userOnDeleteController);

const CARD_PATH = "users/{userUid}/cards/{cardUid}";
const cardOnWrite = firestoreFunctionsBuilder
  .document(CARD_PATH)
  .onWrite(cardOnWriteController);
const cardOnDelete = firestoreFunctionsBuilder
  .document(CARD_PATH)
  .onDelete(cardOnDeleteController);

const CARD_TRANSACTION_PATH = "cardHistory2/{uid}";
const cardHistoryOnWrite = firestoreFunctionsBuilder
  .document(CARD_TRANSACTION_PATH)
  .onWrite(cardHistory2OnWriteController);
const cardHistoryOnDelete = firestoreFunctionsBuilder
  .document(CARD_TRANSACTION_PATH)
  .onDelete(cardHistory2OnDeleteController);

const FILE_PATH = "files/{uid}";
const fileOnWrite = firestoreFunctionsBuilder
  .document(FILE_PATH)
  .onWrite(fileOnWriteController);
const fileOnDelete = firestoreFunctionsBuilder
  .document(FILE_PATH)
  .onDelete(fileOnDeleteController);

const PRINT_JOB_PATH = "kioskJobs/{kioskJobUid}/printJobs/{printJobUid}";
const printJobOnWrite = firestoreFunctionsBuilder
  .document(PRINT_JOB_PATH)
  .onWrite(printJobOnWriteController);
const printJobDelete = firestoreFunctionsBuilder
  .document(PRINT_JOB_PATH)
  .onWrite(printJobOnDeleteController);

export default {
  printHistory2OnWrite,
  printHistory2OnDelete,
  kioskOnWrite,
  kioskOnDelete,
  userOnWrite,
  userOnDelete,
  cardOnWrite,
  cardOnDelete,
  cardHistoryOnWrite,
  cardHistoryOnDelete,
  fileOnWrite,
  fileOnDelete,
  printJobOnWrite,
  printJobDelete,
};
