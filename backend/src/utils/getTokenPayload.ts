import { verify } from "jsonwebtoken";
import { BaseError } from "../errors";
import config from "../config";

export async function extractPayload(token: string) {
  return verify(token, config.jwt.secret!).valueOf();
}
