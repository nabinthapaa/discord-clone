import { httpStatusCode } from "../utils";
import { BaseError } from "./BaseError";

export class UnauthentictedError extends BaseError {
  constructor(message: string = "Not Found") {
    super(message);
    this.status = httpStatusCode.UNAUTHORIZED;
  }
}
