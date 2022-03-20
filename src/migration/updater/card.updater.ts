import { Card } from "../../interface/database";
import { Updater } from "./base";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";
import admin from "firebase-admin";

class CardUpdater extends Updater<Card> {
  constructor() {
    super();
  }

  async fetch(uid: string, collection: string, ...args) {
    if (typeof args[0] !== "string") {
      throw new Error("args[0] must be string");
    }
    const userUid = args[0];

    const querySnap = await admin
      .firestore()
      .collection(`users/${userUid}/cards`)
      .doc(uid)
      .get();
    if (!querySnap.exists) {
      throw new Error(`Not Found:
      collection: ${collection},
      uid: ${uid}`);
    }
    return querySnap.data() as Card;
  }

  async fetchBillingKey(uid: string) {
    const querySnap = await admin
      .firestore()
      .collection("cardCredentials/billingKeys/list")
      .doc(uid)
      .get();
    if (!querySnap.exists) {
      throw new Error(`Not Found: cardCredentials
      uid: ${uid}`);
    }
    const billingKey = querySnap.data()!.key;
    return billingKey as string;
  }

  async createOrUpdateWhenExist(card: Card, ...args): Promise<any> {
    if (typeof args[0] !== "string") {
      throw new Error("args[0] must be string");
    }
    const userUid = args[0];
    const billingKey = await this.fetchBillingKey(card.uid);
    const id = card.uid;

    const now = new Date();
    const relation: Prisma.CardsCreateInput = {
      CardID: id,
      CreatedAt: card.registeredAt.toDate(),
      ModifiedAt: now,
      IsDeleted: 0,
      CheckSum: card.checkSum,
      RejectionMessage: card.rejectedReason,
      MaskedNumber: card.maskedNumber,
      Priority: card.priority,
      VendorCode: card.vendorCode,
      BillingKey: billingKey,
      Users: {
        connect: {
          UserID: userUid,
        },
      },
    };

    await prisma.cards.upsert({
      create: relation,
      update: relation,
      where: {
        CardID: id,
      },
    });
  }

  async update(uid: string, ...args): Promise<any> {
    if (typeof args[0] !== "string") {
      throw new Error("args[0] must be string");
    }
    const userUid = args[0];
    const card = await this.fetch(uid, 'cards', userUid);
    await this.createOrUpdateWhenExist(card, userUid);
  }
}
export const cardUpdater = new CardUpdater();
