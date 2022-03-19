import { PrintHistory2 } from 'interface/database';
import { Updater } from './base';
import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';

class PrintOrderUpdater extends Updater<PrintHistory2> {
  constructor() {
    super();
  }

  async createOrUpdateWhenExist(printHistory: PrintHistory2): Promise<any> {
    const now = new Date();
    const cardHistory = printHistory.related.cardHistory;
    const pointHistory = printHistory.related.pointHistory;
    const relation: Prisma.PrintOrdersCreateInput = {
      PrintOrderID: printHistory.uid,
      CreatedAt: printHistory.addedAt.toDate(),
      ModifiedAt: now,
      IsDeleted: 0,
      CardTransactions: cardHistory ? {
        connect: {
          CardTransactionID: cardHistory.uid,
        }
      } : undefined,
      PointTransactions: pointHistory ? {
        connect: {
          PointTransactionID: pointHistory.uid,
        },
      } : undefined,
      Kiosks: {
        connect: {
          KioskID: printHistory.kiosk.uid,
        }
      },
      Status: printHistory.status,
      Users: {
        connect: {
          UserID: printHistory.userUid,
        }
      }
    };

    await prisma.printOrders.upsert({
      create: relation,
      update: relation,
      where: {
        PrintOrderID: printHistory.uid,
      },
    });
  }

  async update(uid: string): Promise<any> {
    const document = await this.fetch(uid, 'printHistory2');
    await this.createOrUpdateWhenExist(document);
  }
}
export const printOrderUpdater = new PrintOrderUpdater();
