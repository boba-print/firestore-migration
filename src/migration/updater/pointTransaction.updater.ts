import { PointHistory } from '../../interface/database';
import { Updater } from './base';
import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';

class PointTransactionUpdater extends Updater<PointHistory> {
  constructor() {
    super();
  }

  async createOrUpdateWhenExist(pointHistory: PointHistory): Promise<any> {
    const now = new Date();
    const id = pointHistory.uid.substring(0, 40);
    const relation: Prisma.PointTransactionsCreateInput = {
      PointTransactionID: id,
      CreatedAt: pointHistory.addedAt.toDate(),
      Context: pointHistory.context,
      Users: {
        connect: {
          UserID: pointHistory.userUid,
        }
      },
      PointChanged: pointHistory.amount.paid,
      CanceledAmount: 0,
      RemainingPoint: pointHistory.pointRemaining,
    };

    await prisma.pointTransactions.upsert({
      create: relation,
      update: relation,
      where: {
        PointTransactionID: pointHistory.uid,
      },
    });
  }

  async update(uid: string): Promise<any> {
    const user = await this.fetch(uid, 'pointHistory');
    await this.createOrUpdateWhenExist(user);
  }
}
export const pointTransactionUpdater = new PointTransactionUpdater();
