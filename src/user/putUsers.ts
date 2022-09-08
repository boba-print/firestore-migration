import "reflect-metadata";
import fs from "fs/promises";
import path from "path";
import { plainToInstance } from "class-transformer";
import { UserFirestore } from "./schema/User.firestore";
import { validate } from "class-validator";
import admin from "firebase-admin";
import { PrismaClient } from "@prisma/client";
import { _databaseWithOptions } from "firebase-functions/v1/firestore";
export const prisma = new PrismaClient();

(async () => {
  admin.initializeApp();

  const json = await fs.readFile(path.resolve(__dirname, "users.json"));
  const users = JSON.parse(json.toString()) as UserFirestore[];
  const errors = [];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    if (i % 100 === 0) {
      console.log(`doing ${i}/${users.length}`);
    }

    try {
      await prisma.users.upsert({
        where: {
          UserID: user.uid,
        },
        create: {
          UserID: user.uid,
          CreatedAt: new Date(user.history.registeredAt._seconds * 1000),
          ModifiedAt: new Date(user.history.registeredAt._seconds * 1000),
          IsDeleted: 0,
          Email: user.email,
          CheckedNoticeAt: new Date(
            user.history.checkedNoticeAt._seconds * 1000
          ),
          LastVisitedAt: new Date(user.history.signedInAt._seconds * 1000),
          IsDisabled: user.isDisabled ? 1 : 0,
          Name: user.name,
          PhoneNumber: user.phoneNumber,
          Points: user.points,
          StorageAllocated: user.storage.allocated,
          StorageUsed: user.storage.used,
        },
        update: {
          CreatedAt: new Date(user.history.registeredAt._seconds * 1000),
          ModifiedAt: new Date(user.history.registeredAt._seconds * 1000),
          IsDeleted: 0,
          Email: user.email,
          CheckedNoticeAt: new Date(
            user.history.checkedNoticeAt._seconds * 1000
          ),
          LastVisitedAt: new Date(user.history.signedInAt._seconds * 1000),
          IsDisabled: user.isDisabled ? 1 : 0,
          Name: user.name,
          PhoneNumber: user.phoneNumber,
          Points: user.points,
          StorageAllocated: user.storage.allocated,
          StorageUsed: user.storage.used,
        },
      });
    } catch (err) {
      errors.push({ err: err.message, user });
    }

    fs.writeFile(path.resolve(__dirname, "errors.json"), JSON.stringify(errors));
  }
})();
