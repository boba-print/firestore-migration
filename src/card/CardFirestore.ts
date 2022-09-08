import { Timestamp } from '../interface/common/Timestamp';

export interface CardFirestore {
  checkSum: string;
  maskedNumber: string;
  priority: number;
  registeredAt: Timestamp;
  rejectedReason: null | string;
  uid: string;
  vendorCode: string;
  vendorName: string;
  // 커스텀 필드
  userUid: string;
}
