import { User } from "@prisma/client";
import { pbkdf2, pbkdf2Sync, randomBytes } from "node:crypto";

export async function generateSalt() {
  try {
    const buf = randomBytes(64);
    return buf.toString("base64");
  } catch (e) {
    throw e;
  }
}

export async function encryptPassword(password: string, salt: string) {
  try {
    const key = pbkdf2Sync(password, salt, 250000, 64, "sha512");
    return key.toString("base64");
  } catch (e) {
    throw e;
  }
}

export async function validatePassword(user: User, password: string) {
  const key = await encryptPassword(password, user.salt);
  return key === user.password;
}
