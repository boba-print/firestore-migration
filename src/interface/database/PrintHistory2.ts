import firebase from 'firebase/app';
import { Timestamp } from '../common/Timestamp';
import { CardHistory2 } from './CardHistory2';
import { Kiosk } from './Kiosk';
import { PointHistory } from './PointHistory';

export interface PrintHistory2 {
  addedAt: Timestamp;
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
