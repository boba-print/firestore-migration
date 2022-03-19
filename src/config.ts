import path from 'path';
import 'dotenv/config';
import * as admin from 'firebase-admin';
class InitializationError extends Error {
  // 앱 초기화 시 오류
  constructor(message: string) {
    super(message);
    this.name = 'InitializationError';
  }
}

const envs = { ...process.env };
if (!envs.GOOGLE_APPLICATION_CREDENTIALS) {
  throw new InitializationError('GOOGLE_APPLICATION_CREDENTIALS not found');
}
if (!envs.DATABASE_URL) {
  throw new InitializationError('DATABASE_URL not found');
}
if (!envs.STORAGE_BUCKET) {
  throw new InitializationError('STORAGE_BUCKET not found');
}
if (!envs.IMP_KEY || !envs.IMP_SECRET) {
  throw new InitializationError('IMP envs not found');
}
const ghostScriptPath = path.resolve(__dirname, '../ghostscript/./gs');

console.log(`Initialize App with following environment variables
GOOGLE_APPLICATION_CREDENTIALS=${envs.GOOGLE_APPLICATION_CREDENTIALS}
DATABASE_URL=${envs.DATABASE_URL}
STORAGE_BUCKET=${envs.STORAGE_BUCKET}
IMP_KEY=${envs.IMP_KEY}
IMP_SECRET=${envs.IMP_SECRET}
`);

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: envs.DATABASE_URL,
  storageBucket: envs.STORAGE_BUCKET,
});

export function getStorageBucket() {
  return envs.STORAGE_BUCKET as string;
}

export function getIamportConfig() {
  return { impKey: envs.IMP_KEY, impSecret: envs.IMP_SECRET };
}

export const getGhostScriptPath = () => {
  return ghostScriptPath;
};
