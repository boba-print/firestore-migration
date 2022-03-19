import firebase from 'firebase/app';
import 'firebase/firestore';
import { Timestamp } from '../common/Timestamp';

export interface Term {
  lastUpdatedAt: Timestamp;
  location: boolean;
  privacy: boolean;
  promotion: boolean;
  termsOfService: boolean;
  thirdParty: boolean;
}

export interface User {
  email: string;
  fcmTokens: string[];
  history: {
    checkedNoticeAt: Timestamp;
    firstIosUploadAt: Timestamp;
    kiosks: string[];
    registeredAt: Timestamp;
    signedInAt: Timestamp;
  };
  isDisabled: boolean;
  name: string;
  phoneNumber: string;
  points: number;
  storage: {
    allocated: number;
    used: number;
  };
  terms: Term;
  uid: string;
}
