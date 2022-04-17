import { Kiosk } from '../../interface/database';
import { Updater } from './base';
import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';

class KioskUpdater extends Updater<Kiosk> {
  constructor() {
    super();
  }

  async createOrUpdateWhenExist(kiosk: Kiosk): Promise<any> {
    const now = new Date();
    const relation: Prisma.KiosksCreateInput = {
      KioskID: kiosk.uid,
      CreatedAt: now,
      ModifiedAt: now,
      IsDeleted: 0,
      Address: kiosk.address,
      Latitude: 37.1, // dummy
      Longitude: 127.2, // dummy
      BuildingCode: kiosk.buildingCode,
      LastConnectedAt: kiosk.connectedAt.toDate(),
      MaintenancePasscode: "01234",
      Description: kiosk.description,
      Group: kiosk.group,
      ImageUrl: kiosk.imageUrl,
      PriceA4Mono: kiosk.isMono ? kiosk.pricePerPage : undefined,
      PriceA4Color: kiosk.isColor ? kiosk.pricePerPage : undefined,
      IsDuplexPrintable: Number(kiosk.isDuplex),
      Name: kiosk.name,
      Status: kiosk.status,
      Notice: kiosk.notice,
      WorkHour: kiosk.workHour,
      PaperTrayCapacity: Number(kiosk.paperTrayCap),
      NumRemainPaper: kiosk.remainPaper,
      KioskMaintenanceGroups: {
        connect: {
          KioskMaintenanceGroupID: "aba07246-0e81-4438-8cbc-105b1f5a9828",
        },
      },
      Merchants: {
        connect: {
          MerchantID: "1735453f-72a7-4af8-b98a-230f8d14afd0",
        },
      },
    };

    await prisma.kiosks.upsert({
      create: relation,
      update: relation,
      where: {
        KioskID: kiosk.uid,
      },
    });
  }

  async setDeletedOrIgnoreWhenNotExist(uid: string): Promise<any> {
    const kioskRelation = await prisma.kiosks.findUnique({
      where: {
        KioskID: uid,
      }
    });

    if(kioskRelation) {
      kioskRelation.IsDeleted = 1;
      await prisma.kiosks.update({
        where: {
          KioskID: uid,
        },
        data: kioskRelation
      });
    }
  }

  async update(uid: string): Promise<any> {
    const document = await this.fetch(uid, 'kiosks');
    if(document) {
      await this.createOrUpdateWhenExist(document);
    }
    else {
      await this.setDeletedOrIgnoreWhenNotExist(uid);
    }
  }
}
export const kioskUpdater = new KioskUpdater();
