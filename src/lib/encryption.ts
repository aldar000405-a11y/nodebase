import Cryptr from "cryptr";

const key = process.env.ENCRYPTION_KEY;
if (!key) throw new Error("ENCRYPTION_KEY environment variable is not set");

const cryptr = new Cryptr(key);

export const encrypt = (text: string) => cryptr.encrypt(text);
export const decrypt = (text: string) => cryptr.decrypt(text);