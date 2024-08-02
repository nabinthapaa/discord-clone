import { Response, NextFunction } from "express";
import { Request } from "../interfaces";
import { UnauthentictedError } from "../errors";
import { AuthService } from "../services";
import { getCookieOptions } from "../utils";
import config from "../config";
import { getMilliseconds } from "../utils/getMiliSeconds";

export async function cookieChecker(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const cookies = req.cookies;

  if (!cookies.accessToken && cookies.refreshToken) {
    try {
      const accessToken = await AuthService.refresh(cookies.refreshToken);
      const accessTokenCookieExipiry = getMilliseconds(
        config.jwt.accessExpiresIn || "8h",
      );
      res.cookie(
        "accessToken",
        accessToken,
        getCookieOptions({
          maxAge: accessTokenCookieExipiry,
        }),
      );

      req.cookies = {
        ...cookies,
        accessToken,
      };

      next();
    } catch (e) {
      next(e);
    }
  } else if (cookies.accessToken && cookies.refreshToken) next();
  else next(new UnauthentictedError(`No tokens provided`));
}
