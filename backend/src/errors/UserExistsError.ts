import { httpStatusCode } from "../utils";
import { BaseError } from "./BaseError";

export class UserExistsError extends BaseError {
  constructor(message: string = "Not Found") {
    super(message);
    this.status = httpStatusCode.NOT_FOUND;
  }
}
