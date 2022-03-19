import firestore from 'firebase/firestore';

export interface Timestamp extends firestore.FieldValue {
  nanoseconds: number;
  seconds: number;
  toDate: () => Date;
  toMillis: () => number;
  valueOf: () => string;
}

// export type Timestamp =
//   | firebase.firestore.Timestamp
//   | firebase.firestore.FieldValue;
