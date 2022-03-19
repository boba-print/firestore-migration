import firebase from 'firebase/app';
import { Timestamp } from '../common/Timestamp';

export interface UserNotice {
  title: string;
  addedAt: Timestamp;
  imageUrl: string;
  actionUrl: string;
  priority: number;
  contents: string;
  uid: string;
}
