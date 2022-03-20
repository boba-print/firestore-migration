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
    const id = pointHistory.uid;
    let pointChanged: number;
    const { loaded, paid, used } = pointHistory.amount;
    if (loaded !== 0) {
      pointChanged = loaded;
    } else if (used !== 0) {
      pointChanged = -used;
    }

    const relation: Prisma.PointTransactionsCreateInput = {
      PointTransactionID: id,
      CreatedAt: pointHistory.addedAt.toDate(),
      Context: pointHistory.context,
      Users: {
        connect: {
          UserID: pointHistory.userUid,
        }
      },
      PointChanged: pointChanged,
      CanceledAmount: 0,
      RemainingPoint: pointHistory.pointRemaining || -1,
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
