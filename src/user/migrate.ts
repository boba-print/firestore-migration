import "dotenv/config";
import { firestore } from "firebase-admin";
import "../config";
import fs from "fs/promises";
import path from "path";
import admin from 'firebase-admin';
import { UserFirestore } from "./schema/User.firestore";
import { PrismaClient } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";


(async () => {
  // 유저 가져오기
  admin.initializeApp();
  export const prisma = new PrismaClient();

  const snap = await firestore().collection("users").get();
  await fs.writeFile(
    path.resolve(__dirname, "users.json"),
    JSON.stringify(snap.docs.map((doc) => doc.data()))
  );


  // 스키마 검증
  const json = await fs.readFile(path.resolve(__dirname, "users.json"));
  const fromJson = JSON.parse(json.toString());

  const users: UserFirestore[] = fromJson.map((user) =>
    plainToInstance(UserFirestore, user)
  );

  const results = await Promise.all(
    users.map(
      async (uf) => await validate(uf, { skipMissingProperties: false })
    )
  );

  const schemaErrors = results.filter((result) => result.length > 0);
  console.log(schemaErrors.length);
  fs.writeFile(
    path.resolve(__dirname, "SchemaErrors.json"),
    JSON.stringify(schemaErrors)
  );
  

  // DB 에 집어넣기
  const insertErrors = [];
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
          CreatedAt: new Date(
            (user.history.registeredAt?._seconds ?? 0) * 1000
          ),
          ModifiedAt: new Date(
            (user.history.registeredAt?._seconds ?? 0) * 1000
          ),
          IsDeleted: 0,
          Email: user.email,
          CheckedNoticeAt: new Date(
            (user.history.checkedNoticeAt?._seconds ?? 0) * 1000
          ),
          LastVisitedAt: new Date(
            (user.history.signedInAt?._seconds ?? 0) * 1000
          ),
          IsDisabled: user.isDisabled ? 1 : 0,
          Name: user.name,
          PhoneNumber: user.phoneNumber,
          Points: user.points,
          StorageAllocated: user.storage.allocated,
          StorageUsed: user.storage.used,
        },
        update: {
          CreatedAt: new Date(
            (user.history.registeredAt?._seconds ?? 0) * 1000
          ),
          ModifiedAt: new Date(
            (user.history.registeredAt?._seconds ?? 0) * 1000
          ),
          IsDeleted: 0,
          Email: user.email,
          CheckedNoticeAt: new Date(
            (user.history.checkedNoticeAt?._seconds ?? 0) * 1000
          ),
          LastVisitedAt: new Date(
            (user.history.signedInAt?._seconds ?? 0) * 1000
          ),
          IsDisabled: user.isDisabled ? 1 : 0,
          Name: user.name,
          PhoneNumber: user.phoneNumber,
          Points: user.points,
          StorageAllocated: user.storage.allocated,
          StorageUsed: user.storage.used,
        },
      });
    } catch (err) {
      insertErrors.push({ err: err.message, user });
    }

    fs.writeFile(
      path.resolve(__dirname, "InsertErrors.json"),
      JSON.stringify(insertErrors)
    );
})();
