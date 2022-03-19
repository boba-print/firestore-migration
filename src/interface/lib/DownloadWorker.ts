export enum QueStatus {
  'WAITING' = 'WAITING',
  'DOWNLOADING' = 'DOWNLOADING',
  'COMPLETE' = 'COMPLETE',
  'ERROR' = 'ERROR',
}

export interface QueElem {
  curBytes: number,
  errorCode: undefined | string,
  path: undefined | string,
  payload: object,
  status: 'WAITING' | 'DOWNLOADING' | 'COMPLETE' | 'ERROR',
  totalBytes: number,
  uid: string,
  url: string,
}