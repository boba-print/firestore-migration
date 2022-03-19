import firebase from 'firebase/app';
import { Timestamp } from '../common/Timestamp';

export interface Kiosk {
  address: string;
  buildingCode: string;
  description: string;
  group: string;
  imageUrl: string;
  isColor: boolean;
  isDuplex: boolean;
  isMono: boolean;
  isScanner: boolean;
  uid: string;
  maintainer: string;
  mapImageUrl: string;
  name: string;
  pricePerPage: number;
  pricePerCopy: number;
  pricePerScan: number;
  status: string;
  notice: string;
  workHour: string;
  paperTraySize: number;
  remainPaper: number;
  connectedAt: Timestamp;
}
