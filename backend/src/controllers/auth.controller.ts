import { Response } from "express";
import config from "../config";
import {
  IUserWithEmailAndPassword,
  IUserWithoutTypeAndId,
  Request,
} from "../interfaces";
import { AuthService } from "../services";
import {
  getCookieOptions,
  getMilliseconds,
  httpStatusCode,
  loggerWithNameSpace,
} from "../utils";

const logger = loggerWithNameSpace("Auth Controller");

export async function login(
  req: Request<any, any, IUserWithEmailAndPassword>,
  res: Response,
): Promise<Response<any, Record<string, any>>> {
  logger.info(`User with id ${req.user?.id} logging in`);
  const { body } = req;
  const response = await AuthService.login(body);

  const refreshTokenExpiry = getMilliseconds(
    config.jwt.refreshExpiresIn || "7d",
  );
  const accessTokenExpiry = getMilliseconds(config.jwt.accessExpiresIn || "8h");

  return res
    .status(httpStatusCode.ACCEPTED)
    .cookie(
      "refreshToken",
      response.refreshToken,
      getCookieOptions({
        maxAge: refreshTokenExpiry,
      }),
    )
    .cookie(
      "accessToken",
      response.accessToken,
      getCookieOptions({
        maxAge: accessTokenExpiry,
      }),
    )
    .json({
      ...response,
    });
}

export async function register(
  req: Request<any, any, IUserWithoutTypeAndId>,
  res: Response,
): Promise<Response<any, Record<string, any>>> {
  logger.info(`Creating new user`);
  const { body } = req;
  const response = await AuthService.register(body);
  return res.status(httpStatusCode.CREATED).json({
    ...response,
  });
}
