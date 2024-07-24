import { httpStatusCode } from "../utils";
import { BaseError } from "./BaseError";

export class BadRequestError extends BaseError {
  constructor(message: string = "Not Found") {
    super(message);
    this.status = httpStatusCode.BAD_REQUEST;
  }
}
