import { Ticket } from '../common/Ticket';
import { FileOrientation } from '../common/Orientation';

export enum errorCode {
  'NO_PAPER' = 'NO_PAPER',
  'JOB_ERROR' = 'JOB_ERROR',
  'VIEWER_ERROR' = 'VIEWER_ERROR'
}

export enum elemStatus {
  'WAITING' = 'WAITING',
  'STARTED' = 'STARTED',
  'SPOOLING' = 'SPOOLING',
  'PRINTING' = 'PRINTING',
  'ERROR' = 'ERROR',
  'COMPLETE' = 'COMPLETE',
  'RESOLVED' = 'RESOLVED'
}

export interface SpoolElem {
  jobId: string,
  printer: string,
  document: string,
  pagesPrinted: string,
  size: string,
  timeSubmitted: string,
  totalPages: string,
  paperSize: string,
  color: string,
  paperWidth: string,
  paperLength:string,
  status: string[],
}

export interface QueElem {
  mid: string,
  uid: string,
  file: {
    orientation: FileOrientation
    path: string,
  },
  numPages: number,
  errorCode?: errorCode | undefined,
  payload: object,
  spoolingStat: SpoolElem | undefined
  status: elemStatus | undefined,
  submittedAt: number,
  ticket: Ticket,
}