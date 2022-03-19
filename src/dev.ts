import { Request, Response } from "express";
import admin from 'firebase-admin';
import Express from "express";
import * as functions from 'firebase-functions';

const app = Express();
app.get('/getToken', getToken);
export default functions.region('asia-northeast1').https.onRequest(app);


async function getToken(req: Request, res: Response) {
  if (!process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    res.status(403).send("This function is not available in production.");
  }
  const email = req.query.email as string;
  const token = await admin.auth().createCustomToken(email);
  res.send({ token });
}