import firebase from 'firebase/app';
import { Timestamp } from '../common/Timestamp';

export interface PrintHistory {
  addedAt: Timestamp;
  uid: string;
  totalPages: number;
  cardHistoryUid: string | null;
  cardPayment: number;
  pointHistoryUid: string | null;
  pointPayment: number;
  pointRemaining: number;
  receiptUrl: string;
  isRefunded: boolean;
  files: { uid: string; name: string; status: string }[];
  kiosk: {
    uid: string;
    name: string;
    description: string;
    pricePerPage: number;
    isColor: boolean;
  };
  userUid: string;
}
