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
      BuildingCode: kiosk.buildingCode,
      LastConnectedAt: kiosk.connectedAt.toDate(),
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
      PaperTrayCapacity: kiosk.paperTrayCap,
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

  async update(uid: string): Promise<any> {
    const document = await this.fetch(uid, 'kiosks');
    await this.createOrUpdateWhenExist(document);
  }
}
export const kioskUpdater = new KioskUpdater();
