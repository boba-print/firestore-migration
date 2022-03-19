import * as functions from 'firebase-functions';
import { printHistory2MigrationController } from './controller/printHistory2.controller';

const printHistory2 = functions
  .region('asia-northeast1')
  .firestore.document('printHistory2/{uid}').onCreate(printHistory2MigrationController);

export default {
  printHistory2
}