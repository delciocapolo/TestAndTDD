import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";

export const generateHash = (data: string) => {
  return createHash("sha256").update(data).digest("hex");
};

/**
 *
 * @param `data` - must be a string, of the data that need to be compared with encrypted data
 * @param `hash` - must be a string, of the data that are encrypted
 * @returns `boolean`
 */
export const compareHash = (data: string, hash: string): boolean => {
  return isDeepStrictEqual(generateHash(data), hash);
};
