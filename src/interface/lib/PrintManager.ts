import { FileOrientation } from '../common/Orientation';
import { Ticket } from '../common/Ticket';
import { QueElem as DownloadWorkerTask } from './DownloadWorker';
import { QueElem as PrinterWorkerTask } from './PrintWorker'; 

export enum QueStatus {
  'DOWN_PEND' = 'DOWN_PEND',
  'DOWN' = 'DOWN',
  'DOWN_COMP' = 'DOWN_COMP',
  'PRN_PEND' = 'PRN_PEND',
  'READ' = 'READ',
  'SPOOL' = 'SPOOL',
  'PRINTING' = 'PRINTING',
  'COMPLETE' = 'COMPLETE',
  'ERROR' = 'ERROR',
}

export enum SrcOrtn {
  'LANDSCAPE' = 'LANDSCAPE',
  'PORTRAIT' = 'PORTRAIT'
}

export interface QueElem {
  uid: string,
  fileName: string,
  status: QueStatus;
  numPages: number,
  pdfUrl: string;
  printJobUid: string,
  srcOrtn: FileOrientation,
  errorCode: string | undefined,
  payload: object,
  ticket: Ticket;
  downloadTask: DownloadWorkerTask;
  printTask: PrinterWorkerTask | undefined;
}