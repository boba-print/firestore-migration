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
      MantenacePasscode: '01234',
      Description: kiosk.description,
      Group: kiosk.group,
      ImageUrl: kiosk.imageUrl,
      IsMonoPrintable: Number(kiosk.isMono),
      IsColorPrintable: Number(kiosk.isColor),
      IsDuplexPrintable: Number(kiosk.isDuplex),
      ManagerID: kiosk.maintainer,
      RoughMapImageUrl: kiosk.mapImageUrl,
      Name: kiosk.name,
      PricePerPage: kiosk.pricePerPage,
      Status: kiosk.status,
      Notice: kiosk.notice,
      WorkHour: kiosk.workHour,
      PaperTrayCapacity: Number(kiosk.paperTrayCap),
      NumRemainPaper: kiosk.remainPaper,
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
