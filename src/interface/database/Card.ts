import firebase from 'firebase/app';
import { Timestamp } from '../common/Timestamp';

export interface Card {
  checkSum: string;
  maskedNumber: string;
  priority: number;
  registeredAt: Timestamp;
  rejectedReason: null | string;
  uid: string;
  vendorCode: string;
  vendorName: string;
}
