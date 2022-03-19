import { Common } from '..'

export type PrintJobStatus = "CONVERTING" | "COMPLETED" | "ERROR";

export interface PrintJob {
  status: PrintJobStatus;
  errorType: string | null;
  uid: string;
  userUid: string;
  kioskJobUid: string;
  pricePerPage: number | null;
  pages: number;
  price: number | null;
  file: {
    name: string;
    uid: string;
    path: string | null;
    pages: number | null;
    orientation: Common.FileOrientation | null;
  };
  options: Common.Ticket;
}
