import * as functions from "firebase-functions";
import { cardOnWriteController } from "./controller/card.controller";
import { cardHistory2Controller } from "./controller/cardHistory2.controller";
import { kioskMigrationController } from "./controller/kiosk.controller";
import { printHistory2MigrationController } from "./controller/printHistory2.controller";
import { userOnWriteController } from "./controller/user.controller";

const firestoreFunctionsBuilder = functions
  .runWith({
    vpcConnector: "fb-functions-access",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  })
  .region("asia-northeast1").firestore;

const PRINT_HISTORY2_PATH = "printHistory2/{uid}";
const printHistory2 = firestoreFunctionsBuilder
  .document(PRINT_HISTORY2_PATH)
  .onCreate(printHistory2MigrationController);

const KIOSK_PATH = "kiosks/{uid}";
const kioskOnWrite = firestoreFunctionsBuilder
  .document(KIOSK_PATH)
  .onWrite(kioskMigrationController);

const USER_PATH = "users/{uid}";
const userOnWrite = firestoreFunctionsBuilder
  .document(USER_PATH)
  .onWrite(userOnWriteController);

const CARD_PATH = "users/{cardUid}/cards/{cardUid}";
const cardOnWrite = firestoreFunctionsBuilder
  .document(CARD_PATH)
  .onWrite(cardOnWriteController);

const CARD_TRANSACTION_PATH = "cardHistory2/{uid}";
const cardHisotyOnWrite = firestoreFunctionsBuilder
  .document(CARD_TRANSACTION_PATH)
  .onWrite(cardHistory2Controller);

export default {
  printHistory2,
  kioskOnWrite,
  userOnWrite,
  cardOnWrite,
  cardHisotyOnWrite,
};
