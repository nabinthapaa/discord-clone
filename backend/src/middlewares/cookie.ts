import { Response, NextFunction } from "express";
import { Request } from "../interfaces";
import { UnauthentictedError } from "../errors";

export function cookieChecker(req: Request, res: Response, next: NextFunction) {
  const cookies = req.cookies;
  if (!cookies) {
    next(new UnauthentictedError(`No tokens provided`));
  }
  next();
}
