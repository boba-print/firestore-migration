import firebase from 'firebase/app';
import { Timestamp } from '../common/Timestamp';

export interface Alarm {
  addedAt: Timestamp;
  contents: string;
  context: string;
  uid: string;
  readAt: Timestamp;
  detailUid: string;
}
