import admin from "firebase-admin";
import { KioskJob, PrintJob } from "../../interface/database";
import { PrintHistory2 } from "../../interface/response";
import { logger } from "../../logger";

export class PrintJobService {
  async deleteRemainJobWhenPrintHistoryCreated(printHistory: PrintHistory2) {
    const kioskUid = printHistory.kiosk.uid;
    const userUid = printHistory.userUid;

    const kioskJobs = await admin
      .firestore()
      .collection("kioskJobs")
      .where("kiosk.uid", "==", kioskUid)
      .where("owner.uid", "==", userUid)
      .get();

    if (kioskJobs.docs.length === 0) {
      logger.info("Can not find kioskJob. May be already deleted.");
      return;
    }

    // User can make only one kioskJob for one kiosk
    const kioskJob = kioskJobs.docs[0].data() as KioskJob;
    const printJobCollectionPath = `kioskJobs/${kioskJob.uid}/printJobs`;

    const querySnap = await admin
      .firestore()
      .collection(printJobCollectionPath)
      .get();
    const printJobs = querySnap.docs.map((d) => d.data() as PrintJob);

    const whenDeleted = printJobs
      .map((pj) => pj.uid)
      .map((uid) =>
        admin.firestore().doc(`${printJobCollectionPath}/${uid}`).delete()
      );

    // Consider the case that the printJob already deleted
    try {
      await Promise.all(whenDeleted);
    } catch (err) {
      logger.info("Can not delete printJobs. May be already deleted.");
    }

    try {
      await admin.firestore().doc(`kioskJobs/${kioskJob.uid}`).delete();
    }
    catch (err) {
      logger.info("Can not delete kioskJob. May be already deleted.");
    }
  }
}
export const printJobService = new PrintJobService();