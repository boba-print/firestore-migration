export interface FCM {
  tokens: string[];
  notification: {
    title: string;
    body: string;
  };
}

export interface FcmResponse {
  status: 'success' | 'fail';
  total: number;
  successCount: number;
  failureCount: number;
  failedTokens: string[];
}
