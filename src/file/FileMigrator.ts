import { File } from "../interface/database";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";
import admin, { firestore } from "firebase-admin";
import fs from "fs/promises";
import path from "path";

class FileMigrator {
  constructor() {
    admin.initializeApp();
  }

  async fetchAll() {
    const snap = await firestore().collection('files').get();
    const files = snap.docs.map(doc => doc.data()) as File[];
    return files;
  }

  async createOrUpdateWhenExist(f: File): Promise<any> {
    const now = new Date();

    const { userUid } = f;

    const relation: Prisma.FilesCreateInput = {
      FileID: f.uid,
      CreatedAt: f.uploadedAt.toDate(),
      ModifiedAt: now,
      IsDeleted: 0,
      OriginalGSPath: f.originalFilePath,
      OriginalName: f.originalName,
      ViewName: f.viewName,
      Size: f.size,
      Users: {
        connect: {
          UserID: userUid,
        },
      },
      ErrorType: f.errorType ?? null,
    };

    if (f.status === "COMPLETED") {
      const convertedFileRelation: Prisma.FilesConvertedCreateInput = {
        FileConvertedID: f.uid,
        CreatedAt: f.covertedAt.toDate(),
        Orientation: f.info.orientation,
        NumPages: f.info.pages,
        ThumbnailsGSPath: f.imgsPath,
        ConvertedFileGSPath: f.convertedFilePath,
        Users: {
          connect: {
            UserID: userUid,
          },
        },
      };

      await prisma.filesConverted.upsert({
        create: convertedFileRelation,
        update: convertedFileRelation,
        where: {
          FileConvertedID: f.uid,
        },
      });

      relation.FilesConverted = {
        connect: {
          FileConvertedID: f.uid,
        },
      };
    }

    await prisma.files.upsert({
      create: relation,
      update: relation,
      where: {
        FileID: f.uid,
      },
    });
  }
}
export const fileMigrator = new FileMigrator();


if (require.main === module) {
  (async () => {
    const cards = await fileMigrator.fetchAll();
    fs.writeFile(path.resolve(__dirname, "files.json"), JSON.stringify(cards));

    // const data = await fs.readFile(path.resolve(__dirname, "cards.json"));
    // const cards = JSON.parse(data.toString()) as CardFirestore[];

    const errors = [];

    let numSuccess = 0;
    let numFailed = 0;
    const timer = setInterval(() => {
      console.log(`${numSuccess}/${cards.length}, errors:${numFailed}`);
    }, 1000);

    for (let i = 0; i < cards.length; i += 5) {
      (
        cards.slice(i, i + 5).map(async (card) => {
          try {
            await fileMigrator.createOrUpdateWhenExist(card);
            numSuccess++;
          } catch (err) {
            errors.push({ card, err: err.message });
            numFailed++;
          }
        })
      );
    }

    await fs.writeFile(
      path.resolve(__dirname, "insertErrors.json"),
      JSON.stringify(errors)
    );

    clearInterval(timer);
    console.log(`${numSuccess}/${cards.length}, errors:${numFailed}`);
  })();
}
