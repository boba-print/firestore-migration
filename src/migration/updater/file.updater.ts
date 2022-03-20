import { File } from '../../interface/database';
import { Updater } from './base';
import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';
import { NotFoundError } from '../../error';

class FileUpdater extends Updater<File> {
  constructor() {
    super();
  }

  async createOrUpdateWhenExist(f: File): Promise<any> {
    const now = new Date();

    const { userUid } = f;
    const userIsExists = prisma.users.findUnique({
      where: {
        UserID: userUid,
      },
      select: {
        UserID: true,
      }
    });
    if (!userIsExists) {
      throw new NotFoundError(`Not Found in MySQL:
      table: users,
      UserID: ${userUid}`);
    }

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
        }
      },
    };

    if(f.status === 'COMPLETED') {
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
          }
        }
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
        }
      }
    }

    await prisma.files.upsert({
      create: relation,
      update: relation,
      where: {
        FileID: f.uid,
      },
    });
  }

  async update(uid: string): Promise<any> {
    const document = await this.fetch(uid, 'files');
    await this.createOrUpdateWhenExist(document);
  }
}
export const fileUpdater = new FileUpdater();
