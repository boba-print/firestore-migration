import { User } from '../../interface/database';
import { Updater } from './base';
import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';

class UserUpdater extends Updater<User> {
  constructor() {
    super();
  }

  async createOrUpdateWhenExist(user: User): Promise<any> {
    const now = new Date();
    const userRelation: Prisma.UsersCreateInput = {
      UserID: user.uid,
      CreatedAt: now,
      ModifiedAt: now,
      IsDeleted: 0,
      Email: user.email,
      LastVisitedAt: null,
      IsDisabled: user.isDisabled ? 1 : 0,
      Name: user.name,
      PhoneNumber: user.phoneNumber,
      Points: user.points,
      StorageAllocated: user.storage.allocated,
      StorageUsed: user.storage.used,
    };


    await prisma.users.upsert({
      create: userRelation,
      update: userRelation,
      where: {
        UserID: user.uid,
      }
    });
  }

  async update(uid: string): Promise<any> {
    const user = await this.fetch(uid, "users");
    await this.createOrUpdateWhenExist(user);
  }
}
export const userUpdater = new UserUpdater();
