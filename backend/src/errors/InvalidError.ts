import { httpStatusCode } from "../utils";
import { BaseError } from "./BaseError";

export class InvalidError extends BaseError {
  constructor(message: string = "Invalid Data") {
    super(message);
    this.status = httpStatusCode.NOT_FOUND;
  }
}
