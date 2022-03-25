import admin from "firebase-admin";
import { logger } from "firebase-functions/v1";

export abstract class Updater<T> {
  public async fetch(
    uid: string,
    collctionName: string,
    ...args
  ): Promise<T | null> {
    const querySnap = await admin
      .firestore()
      .collection(collctionName)
      .where("uid", "==", uid)
      .get();
    if (querySnap.docs.length === 0) {
      logger.warn("Not Found", {
        collection: collctionName,
        uid,
      });
      return null;
    }
    return querySnap.docs[0].data() as T;
  }
  abstract createOrUpdateWhenExist(T, ...args): Promise<any>;
  abstract setDeletedOrIgnoreWhenNotExist(uid: string, ...args): Promise<any>;
  abstract update(uid: string, ...args): Promise<any>;
}
