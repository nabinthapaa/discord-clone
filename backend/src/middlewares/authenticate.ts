import cookie from "cookie";
import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import { Socket } from "socket.io";
import config from "../config";
import { BaseError, NotFoundError, UnauthentictedError } from "../errors";
import { AuthResponse, IUser, Request } from "../interfaces";
import { SocketNext } from "../types";

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

/**
 * Middleware to authenticate WebSocket connections.
 *
 * This function checks for an authentication cookie in the socket handshake headers,
 * verifies the JWT access token, and either allows the connection to proceed or throws
 * an error based on the verification result.
 *
 * @param {Socket} socket - The WebSocket connection socket.
 * @param {SocketNext} next - The next middleware function to call if authentication is successful.
 */
export function authenticateSocketConnection(socket: Socket, next: SocketNext) {
  console.log("Socket check");
  const cookies = cookie.parse(socket.handshake.headers.cookie || "");
  if (!cookies) {
    console.log("Not found cookies");
    return next(new UnauthentictedError(`No tokens found`));
  }
  const { accessToken }: Partial<AuthResponse> = cookies;

  if (!accessToken) {
    return next(new NotFoundError(`Tokens missing`));
  }

  verify(accessToken, config.jwt.secret!, (error, data) => {
    if (error) {
      return next(new BaseError(error.message));
    }

    if (typeof data !== "string" && data) {
      next();
    }
  });
}
