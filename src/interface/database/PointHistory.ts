import firebase from 'firebase/app';
import { Timestamp } from '../common/Timestamp';

export interface PointHistory {
  addedAt: Timestamp;
  amount: {
    paid?: number;
    loaded?: number;
    used?: number;
  };
  description: string;
  context: string;
  type?: string;
  kakaoPay: {
    status: string;
    partner_order_id: string;
    partner_user_id: string;
    tid: string;
    response: any;
  };
  uid: string;
  userUid: string;
  pointRemaining?: number;
}
