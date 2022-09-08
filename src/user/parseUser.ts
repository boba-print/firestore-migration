import fs from "fs/promises";
import path from "path";

(async () => {
  const json = await fs.readFile(path.resolve(__dirname, "users.json"));
  const users = JSON.parse(json.toString());
  console.log(users.length);
})();
