import firebase from 'firebase/app';
import { Timestamp } from '../common/Timestamp';

export interface CardHistory2 {
  addedAt: Timestamp;
  uid: string;
  amount: {
    paid: number;
    toPay: number;
    refunded: number;
  };
  rejected?: { cardUid: string; response: any }[];
  paid: {
    cardUid: string;
    response: any;
  };
  refunded?: { response: any }[];
  status: string;
  userUid: string;
}
