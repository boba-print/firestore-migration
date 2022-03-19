import { Timestamp } from '../common/Timestamp';
import { CardHistory2 } from './CardHistory2';
import { PointHistory } from './PointHistory';

export interface PurchaseHistory {
  addedAt: Timestamp;
  uid: string;
  type: string;
  related: {
    cardHistory?: CardHistory2;
    pointHistory?: PointHistory;
  };
  amount: number;
  userUid: string;
}
