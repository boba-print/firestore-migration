import {Ticket} from '../../../common/Ticket';
import {PrintJobStatus} from '../../../common/Status';
import {FileOrientation} from '../../../common/Orientation';

export interface GetJobResp {
  owner: {
    name: string;
  };
  printJobs: [
    {
      errorType: string | null;
      file: {
        name: string;
        orientation: FileOrientation;
        pages: number;
      };
      options: Ticket;
      pages: number;
      price: number;
      status: PrintJobStatus;
      imgs: string[];
      printJobUid: string;
    }
  ];
}
