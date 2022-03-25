import admin from "firebase-admin";
import { KioskJob, PrintJob, PrintHistory2 } from "../../interface/database";
import { logger } from "../../logger";

export class PrintJobService {
  async findJobsWithKioskUidAndUserUid(
    kioskUid: string,
    userUid: string
  ): Promise<{
    kioskJob: KioskJob | null;
    printJobs: PrintJob[];
  }> {
    const kioskJobQuerySnap = await admin
      .firestore()
      .collection("kioskJobs")
      .where("kiosk.uid", "==", kioskUid)
      .where("owner.uid", "==", userUid)
      .get();

    if (kioskJobQuerySnap.docs.length === 0) {
      logger.warn("Can not find kioskJob. May be already deleted.");
      return {
        kioskJob: null,
        printJobs: [],
      };
    }
    // User can make only one kioskJob for one kiosk
    const kioskJob = kioskJobQuerySnap.docs[0].data() as KioskJob;

    const printJobCollectionPath = `kioskJobs/${kioskJob.uid}/printJobs`;
    const printJobQuerySnap = await admin
      .firestore()
      .collection(printJobCollectionPath)
      .get();
    const printJobs = printJobQuerySnap.docs.map((d) => d.data() as PrintJob);
    return {
      kioskJob,
      printJobs,
    };
  }

  async deleteRemainJobWhenPrintHistoryCreated(printHistory: PrintHistory2) {
    const kioskUid = printHistory.kiosk.uid;
    const userUid = printHistory.userUid;

    const { kioskJob, printJobs } = await this.findJobsWithKioskUidAndUserUid(
      kioskUid,
      userUid
    );

    const whenDeleted = printJobs
      .map((pj) => pj.uid)
      .map((uid) =>
        admin
          .firestore()
          .doc(`kioskJobs/${kioskJob.uid}/printJobs/${uid}`)
          .delete()
      );

    // Consider the case that the printJob already deleted
    try {
      await Promise.all(whenDeleted);
    } catch (err) {
      logger.warn("Can not delete printJobs. May be already deleted.");
    }

    if (!kioskJob) {
      return;
    }

    try {
      await admin.firestore().doc(`kioskJobs/${kioskJob.uid}`).delete();
    } catch (err) {
      logger.warn("Can not delete kioskJob. May be already deleted.");
    }
  }
}
export const printJobService = new PrintJobService();
