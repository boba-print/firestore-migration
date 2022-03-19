import firebase from 'firebase/app';
import { Timestamp } from '../common/Timestamp';

export interface CardHistory {
  addedAt: Timestamp;
  amount: number;
  cardUid: string;
  customData: string;
  impUid: string;
  reason: string | null;
  receiptUrl: string;
  status: string;
  vendorName: string;
  vendorCode: string;
  uid: string;
  userUid: string;
}
