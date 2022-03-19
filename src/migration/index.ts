import * as functions from 'firebase-functions';

const printHistory2 = functions
  .region('asia-northeast1')
  .firestore.document('printHistory2/{uid}').onCreate((snap, ctx) => {
    
  });

export default {
  printHistory2
}