import { PaperOrientation } from "./Orientation";

export type order = "DOWN_TO_RIGHT" | "RIGHT_TO_DOWN";
export type nUp = 1 | 2 | 4 | 6 | 8;
export type duplex = "ONE_SIDED" | "TWO_SIDE_LONG" | "TWO_SIDE_SHORT";
export type fitToPage =  "FIT_TO_PAGE" | "NO_FITTING";

export interface Ticket {
  version: string;
  layout: {
    order: order;
    nUp: nUp;
  };
  copies: number;
  duplex: duplex;
  fitToPage: fitToPage;
  isColor: boolean;
  pageRanges: {
    start: number;
    end: number;
  }[];
  paperOrientation: PaperOrientation;
}
