import { NotFoundError } from "../../error";
import admin from 'firebase-admin';

export abstract class Updater<T> {
  public async fetch(uid: string, collctionName: string, ...args): Promise<T> {
    const querySnap = await admin
      .firestore()
      .collection(collctionName)
      .where('uid', '==', uid)
      .get();
    if (querySnap.docs.length === 0) {
      throw new NotFoundError(`Not Found:
      collection: ${collctionName},
      uid: ${uid}`);
    }
    return querySnap.docs[0].data() as T;
  }
  abstract createOrUpdateWhenExist(T, ...args): Promise<any>;
  abstract update(uid: string): Promise<any>;
}
