import { createHash } from "node:crypto";

const hash = createHash("sha256");

hash.update("Delcio");
console.log(hash.digest("hex"));

(async () => {
  const arr = await hash.toArray();
  console.log("retornando");
  console.log(Array.isArray(arr));
})();
