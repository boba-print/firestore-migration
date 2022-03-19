export interface PayForJobResp {
  receiptUrl: string | null;
  refundUrl: string | null;
  downloadUrls: {
    uid: string,
    url: string,
  }[];
  merchantUid: string | null;
  details: string[];
}