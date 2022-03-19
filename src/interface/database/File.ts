import firebase from 'firebase/app';
import 'firebase/firestore';
import { Common } from '..';
import { Timestamp } from '../common/Timestamp'; 

export interface File {
  convertedAt?: Timestamp;
  convertedFilePath?: string;
  errorType: string | null;
  imgsPath?: string;
  info?: {
    orientation: Common.FileOrientation;
    pages: number;
  };
  originalFilePath: string;
  originalName: string;
  size: number;
  status: Common.FileStatus;
  uid: string;
  uploadedAt: Timestamp;
  userUid: string;
  viewName: string;
}
