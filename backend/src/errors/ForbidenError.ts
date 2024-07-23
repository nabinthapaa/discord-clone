import { httpStatusCode } from "../utils";
import { BaseError } from "./BaseError";

export class ForbiddenError extends BaseError {
  constructor(message: string = "Not Found") {
    super(message);
    this.status = httpStatusCode.FORBIDDEN;
  }
}
