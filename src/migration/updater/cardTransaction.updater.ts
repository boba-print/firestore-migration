import { CardHistory2 } from '../../interface/database';
import { Updater } from './base';
import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';

class CardTransactionsUpdater extends Updater<CardHistory2> {
  constructor() {
    super();
  }

  async createOrUpdateWhenExist(cardHistory: CardHistory2): Promise<any> {
    const id = cardHistory.uid;
    const relation: Prisma.CardTransactionsCreateInput = {
      CardTransactionID: id,
      CreatedAt: cardHistory.addedAt.toDate(),
      Amount: cardHistory.amount.paid,
      CanceledAmount: cardHistory.amount.refunded,
      Cards: {
        connect: {
          CardID: cardHistory.paid.cardUid,
        }
      },
      IamportUID: cardHistory.paid.response.imp_uid, // string
      ReceiptURL: cardHistory.paid.response.receipt_url,
      Users: {
        connect: {
          UserID: cardHistory.userUid,
        }
      }
    };

    await prisma.cardTransactions.upsert({
      create: relation,
      update: relation,
      where: {
        CardTransactionID: cardHistory.uid,
      },
    });
  }

  async update(uid: string): Promise<any> {
    const user = await this.fetch(uid, 'cardHistory2');
    await this.createOrUpdateWhenExist(user);
  }
}
export const cardTransactionsUpdater = new CardTransactionsUpdater();
