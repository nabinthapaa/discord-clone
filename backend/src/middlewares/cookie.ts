import { Response, NextFunction } from "express";
import { Request } from "../interfaces";

export function cookieChecker(req: Request, res: Response, next: NextFunction) {
  const cookies = req.cookies;

  console.log(cookies);
  next();
}
