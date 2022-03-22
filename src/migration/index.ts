import * as functions from "firebase-functions";
import { kioskMigrationController } from "./controller/kiosk.controller";
import { printHistory2MigrationController } from "./controller/printHistory2.controller";

const firestoreFunctionsBuilder = functions
  .runWith({
    vpcConnector: "fb-functions-access",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  })
  .region("asia-northeast1").firestore;

const printHistory2 = firestoreFunctionsBuilder
  .document("printHistory2/{uid}")
  .onCreate(printHistory2MigrationController);

const KIOSK_PATH = "kiosk/{uid}";
const kioskOnWrite = firestoreFunctionsBuilder
  .document(KIOSK_PATH)
  .onWrite(kioskMigrationController);


export default {
  printHistory2,
  kioskOnWrite,
};