import { CardFirestore } from "./CardFirestore";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";
import admin from "firebase-admin";
import fs from "fs/promises";
import path from "path";
import { Card } from "../interface/database";
import { cardStreamMigrationService } from "../migration/service/card.service";

class CardMigrator {
  constructor() {
    admin.initializeApp();
  }

  async fetchAll() {
    const querySnap = await admin.firestore().collectionGroup("cards").get();

    return querySnap.docs.map(
      (d) =>
        ({
          userUid: d.ref.parent.parent.id,
          ...d.data(),
        } as Card)
    );
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

  async createOrUpdateWhenExist(card: CardFirestore): Promise<any> {
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
          UserID: card.userUid,
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
}
export const cardMigrator = new CardMigrator();

if (require.main === module) {
  (async () => {
    const cards = await cardMigrator.fetchAll();
    // fs.writeFile(path.resolve(__dirname, "cards.json"), JSON.stringify(cards));

    // const data = await fs.readFile(path.resolve(__dirname, "cards.json"));
    // const cards = JSON.parse(data.toString()) as CardFirestore[];

    const errors = [];

    let numSuccess = 0;
    let numFailed = 0;
    const timer = setInterval(() => {
      console.log(`${numSuccess}/${cards.length}, errors:${numFailed}`);
    }, 1000);

    for (let i = 0; i < cards.length; i += 20) {
      await Promise.all(cards.slice(i, i + 20).map(async (card) => {
        try {
          await cardMigrator.createOrUpdateWhenExist(card);
          numSuccess++;
        } catch (err) {
          errors.push({ card, err: err.message });
          numFailed++;
        }
      }))
    }

    await fs.writeFile(
      path.resolve(__dirname, "insertErrors.json"),
      JSON.stringify(errors)
    );

    clearInterval(timer);
    console.log(`${numSuccess}/${cards.length}, errors:${numFailed}`);
  })();
}
