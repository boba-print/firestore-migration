import { PointHistory } from '../../interface/database';
import { Updater } from './base';
import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';
import { logger } from 'firebase-functions/v1';

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

  async setDeletedOrIgnoreWhenNotExist(pointHistory: PointHistory): Promise<any> {
    logger.error('pointHistory is deleted. Which should not be deleted');
  }

  async update(uid: string): Promise<any> {
    const pointHistory = await this.fetch(uid, 'pointHistory');

    if(pointHistory) {
      await this.createOrUpdateWhenExist(pointHistory);
    }
    else {
      await this.setDeletedOrIgnoreWhenNotExist(pointHistory);
    }
  }
}
export const pointTransactionUpdater = new PointTransactionUpdater();
