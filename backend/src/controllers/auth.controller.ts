import { Response } from "express";
import { Request } from "../interfaces/auth.interface";
import {
  IUserWithEmailAndPassword,
  IUserWithoutTypeAndId,
} from "../interfaces/user.interface";
import { httpStatusCode, loggerWithNameSpace } from "../utils";
import { AuthService } from "../services";

const logger = loggerWithNameSpace("Auth Controller");

export async function login(
  req: Request<any, any, IUserWithEmailAndPassword>,
  res: Response,
): Promise<Response<any, Record<string, any>>> {
  logger.info(`User with id ${req.user?.id} logging in`);
  const { body } = req;
  const response = await AuthService.login(body);

  return res.status(httpStatusCode.ACCEPTED).json({
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
