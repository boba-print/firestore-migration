import "dotenv/config";
import { firestore } from "firebase-admin";
import "../config";
import fs from "fs/promises";
import path from "path";

(async () => {
  const snap = await firestore().collection("users").get();
  await fs.writeFile(
    path.resolve(__dirname, "users.json"),
    JSON.stringify(snap.docs.map((doc) => doc.data()))
  );
})();
