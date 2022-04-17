import { KioskJob, PrintJob } from "../../interface/database";
import { Updater } from "./base";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";
import admin from "firebase-admin";
import { DocumentSnapshot } from "firebase/firestore";

class PrintJobUpdater extends Updater<PrintJob> {
  constructor() {
    super();
  }

  async fetchKioskJob(uid: string) {
    let documentSnap: admin.firestore.DocumentSnapshot;
    try {
      documentSnap = await admin.firestore().doc(`kioskJobs/${uid}`).get();
    } catch (err) {
      return null;
    }
    return documentSnap.data() as KioskJob;
  }

  async createOrUpdateWhenExist(
    printJob: PrintJob,
    kioskJobUid: string
  ): Promise<any> {
    const kioskJob = await this.fetchKioskJob(kioskJobUid);

    const now = new Date();
    const { options } = printJob;
    const printJobRelation: Prisma.PrintJobsCreateInput = {
      PrintJobID: printJob.uid,
      CreatedAt: now,
      ModifiedAt: now,
      IsDeleted: 0,
      Kiosks: {
        connect: {
          KioskID: kioskJob.kiosk.uid,
        },
      },
      Users: {
        connect: {
          UserID: kioskJob.owner.uid,
        },
      },
      Files: {
        connect: {
          FileID: printJob.file.uid,
        },
      },
      NumPrintPages: printJob.pages,
      VerificationNumber: kioskJob.verifyNumber.toString().padStart(5, "0"),
      NumCopies: options.copies,
      PageFitting: options.fitToPage,
      Duplex: options.duplex,
      NUp: options.layout.nUp,
      LayoutOrder: options.layout.order,
      PaperOrientation: options.paperOrientation,
      IsColor: !!options.isColor ? 1 : 0,
      PageRanges: options.pageRanges
        .map((rg) => `${rg.start}-${rg.end}`)
        .join(","),
    };

    await prisma.printJobs.upsert({
      create: printJobRelation,
      update: printJobRelation,
      where: {
        PrintJobID: printJob.uid,
      }
    });
  }

  async setDeletedOrIgnoreWhenNotExist(uid: string): Promise<any> {
    const printJobRelation = await prisma.printJobs.findUnique({
      where: {
        PrintJobID: uid,
      }
    });

    if(printJobRelation) {
      printJobRelation.IsDeleted = 1;
      printJobRelation.ModifiedAt = new Date();
      await prisma.printJobs.update({
        where: {
          PrintJobID: uid,
        },
        data: printJobRelation,
      });
    }
  }

  // args[0]: kioskJobUid
  async update(uid: string, kioskJobUid: string): Promise<any> {
    if (typeof kioskJobUid !== "string") {
      throw new Error("Need args[0]: kioskJobUid");
    }

    const printJob = await this.fetch(
      uid,
      `kioskJobs/${kioskJobUid}/printJobs`
    );

    if (printJob) {
      await this.createOrUpdateWhenExist(printJob, kioskJobUid);
    } else {
      await this.setDeletedOrIgnoreWhenNotExist(printJob.uid);
    }
  }
}
export const printJobUpdater = new PrintJobUpdater();
