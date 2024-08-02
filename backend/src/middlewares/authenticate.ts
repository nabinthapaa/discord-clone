import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import config from "../config";
import { BaseError } from "../errors";
import { IUser, Request } from "../interfaces";

/**
 * Middleware function to authenticate requests using JWT token.
 *
 * @param {Request} req - The `Custom Request` inheriting express Request object.
 * @param {Response} res - Response object (unused in this function).
 * @param {NextFunction} next - NextFunction object (unused in this function).
 * @throws {UnauthenticatedError} - If authorization header is missing or invalid.
 * @throws {BaseError} - If there is an issue verifying the JWT token.
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const { accessToken } = req.cookies;

  verify(accessToken, config.jwt.secret!, (error, data) => {
    if (error) {
      return next(new BaseError(error.message));
    }

    if (typeof data !== "string" && data) {
      req.user = data as Omit<IUser, "password">;
      next();
    }
  });
}
