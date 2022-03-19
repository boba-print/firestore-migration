import firebase from 'firebase/app';
import { Timestamp } from '../common/Timestamp';

export interface ScanCopyJob {
  addedAt: Timestamp;
  kiosk: {
    description: string;
    name: string;
    pricePerCopy: number;
    pricePerScan: number;
    uid: string;
  };
  owner: {
    name: string;
    uid: string;
  };
  uid: string;
  verifyNum: string;
}
