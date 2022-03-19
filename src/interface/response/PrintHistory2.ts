import firebase from 'firebase/app';
import { CardHistory2 } from '../database/CardHistory2';
import { Kiosk } from '../database/Kiosk';
import { PointHistory } from '../database/PointHistory';

export interface PrintHistory2 {
  addedAt: number;
  uid: string;
  totalPages: number;
  related: {
    cardHistory: CardHistory2;
    pointHistory: PointHistory;
  };
  amount: {
    price: number;
    point: number;
    card: number;
    pointRemaining: number;
  };
  status: string;
  method: string;
  files: { uid: string; name: string; status: string }[];
  kiosk: Kiosk;
  userUid: string;
}
