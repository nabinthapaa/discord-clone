import { NextFunction } from "express";
import { ForbiddenError, UnauthentictedError } from "../errors";
import { Request } from "../interfaces";
import { EUserType } from "../enums";

/**
 * Performs an authorization check while accessing user data
 * for routes `/users/**`
 * checks `id` passed in as query paramater against JWT token of
 * user. processes request if matched else throws forbidden error
 *
 * for routes in `/admin/**`
 * checks the permissions array of the user in JWT token and if they
 * have permission process the request further. if not throw
 * `Forbidden error`
 *
 * @param permission {string | undefined} - permissions to check against. "id" is for routes other than `/admin/**`
 */

export function authorize() {
  return async (req: Request, _: Response, next: NextFunction) => {
    if (!req.user) {
      next(new UnauthentictedError(`Please login first`));
    }

    if (req.user && req.user.type === EUserType.ADMIN) {
      next();
    } else {
      next(new ForbiddenError(`Unaccessible route`));
    }
  };
}
