import firebase from 'firebase/app';
import 'firebase/firestore';
import { PrintJob } from './PrintJob';
import { Timestamp } from '../common/Timestamp';

export interface KioskJob {
  addedAt: Timestamp;
  uid: string;
  kiosk: {
    uid: string;
    description: string;
    name: string;
    pricePerPage: number;
    isColor: boolean;
  };
  owner: {
    uid: string;
    name: string;
  };
  verifyNumber: number;
  printJobs?: PrintJob[];
}
