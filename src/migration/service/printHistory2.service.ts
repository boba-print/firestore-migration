import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";
import { Ticket } from "../../interface/common";
import { fileUpdater } from "../../migration/updater/file.updater";
import { kioskUpdater } from "../../migration/updater/kiosk.updater";
import { pointTransactionUpdater } from "../../migration/updater/pointTransaction.updater";
import { v4 as uuidv4 } from "uuid";
import { printOrderUpdater } from "../../migration/updater/printOrder.updater";
import { cardTransactionUpdater } from "../../migration/updater/cardTransaction.updater";
import { userUpdater } from "../../migration/updater/user.updater";
import { cardUpdater } from "../../migration/updater/card.updater";

const defaultTicket: Ticket = {
  copies: 1,
  fitToPage: "FIT_TO_PAGE",
  duplex: "TWO_SIDE_LONG",
  layout: {
    nUp: 1,
    order: "RIGHT_TO_DOWN",
  },
  paperOrientation: "AUTO",
  isColor: false,
  pageRanges: [],
  version: "V2.0",
};

export async function printHistory2MigrationService(printHistoryUid: string) {
  const printHistory2 = await printOrderUpdater.fetch(
    printHistoryUid,
    "printHistory2"
  );

  const cardHistory = printHistory2.related.cardHistory;
  let cardHistoryUid: string | null = null;
  if (cardHistory) {
    cardHistoryUid = cardHistory.uid;
  }

  const pointHistory = printHistory2.related.pointHistory;
  let pointHistoryUid: string | null = null;
  if (pointHistory) {
    pointHistoryUid = pointHistory.uid;
  }

  const userUid = printHistory2.userUid;
  const kioskUid = printHistory2.kiosk.uid;
  const fileUids = printHistory2.files.map((file) => file.uid);

  // migrate or update user, kiosk, file, card documents
  await userUpdater.update(userUid);
  await kioskUpdater.update(kioskUid);
  await Promise.all(fileUids.map((fileUid) => fileUpdater.update(fileUid)));
  if(cardHistoryUid) {
    await cardUpdater.update(cardHistory.paid.cardUid, userUid);
  }
  
  // migrate or update CardHistory2 or PointHistory document
  if (cardHistoryUid) {
    await cardTransactionUpdater.update(cardHistoryUid);
  }
  if(pointHistoryUid) {
    await pointTransactionUpdater.update(pointHistoryUid);
  }

  // create new printOrder records
  await printOrderUpdater.createOrUpdateWhenExist(printHistory2);

  // make printJobs
  const now = new Date();
  const toPrintJobRelation = (fileUid: string) => {
    const printJobRelation: Prisma.PrintJobsCreateInput = {
      PrintJobID: uuidv4(),
      CreatedAt: now,
      ModifiedAt: now,
      IsDeleted: 1,
      Kiosks: {
        connect: {
          KioskID: kioskUid,
        },
      },
      Users: {
        connect: {
          UserID: userUid,
        },
      },
      Files: {
        connect: {
          FileID: fileUid,
        },
      },
      NumPrintPages: 10,
      VerificationNumber: "00000",
      NumCopies: 1,
      PageFitting: "FIT_TO_PAGE",
      Duplex: "TWO_SIDE_LONG",
      NUp: 2,
      LayoutOrder: "RIGHT_TO_DOWN",
      PaperOrientation: "AUTO",
      IsColor: 1,
      PageRanges: "1-2,3",
    };
    return printJobRelation;
  };
  const printJobRelations = fileUids.map((fileUid) =>
    toPrintJobRelation(fileUid)
  );
  const whenPrintJobsCreated = printJobRelations.map((r) =>
    prisma.printJobs.create({
      data: r,
    })
  );
  await Promise.all(whenPrintJobsCreated);

  // relate printJobs with printOrder
  const whenRelationCreated = printJobRelations.map((r) =>
    prisma.printOrder_PrintJob.create({
      data: {
        PrintJobs: {
          connect: {
            PrintJobID: r.PrintJobID,
          },
        },
        PrintOrders: {
          connect: {
            PrintOrderID: printHistory2.uid,
          },
        },
      },
    })
  );
  await Promise.all(whenRelationCreated);
}
