import "reflect-metadata";
import fs from "fs/promises";
import path from "path";
import { plainToInstance } from "class-transformer";
import { UserFirestore } from "./schema/User.firestore";
import { validate } from "class-validator";

(async () => {
  const json = await fs.readFile(path.resolve(__dirname, "users.json"));
  const users = JSON.parse(json.toString());
  console.log(users.length);

  const userFirestores: UserFirestore[] = users.map((user) =>
    plainToInstance(UserFirestore, user)
  );

  const results = await Promise.all(
    userFirestores.map(async (uf) => await validate(uf))
  );

  const errors = results.filter((result) => result.length > 0);
  console.log(errors.length);
  fs.writeFile(
    path.resolve(__dirname, "userErrors.json"),
    JSON.stringify(errors)
  );
})();
