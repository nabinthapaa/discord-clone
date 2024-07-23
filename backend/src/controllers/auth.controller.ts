import { Response } from "express";
import { Request } from "../interfaces/auth.interface";
import { IUserWithEmailAndPassword } from "../interfaces/user.interface";
import { httpStatusCode, loggerWithNameSpace } from "../utils";
import { AuthService } from "../services";

const logger = loggerWithNameSpace("Auth Controller");

export async function login(
  req: Request<any, any, IUserWithEmailAndPassword>,
  res: Response,
) {
  logger.info(`User with id ${req.user?.id} logging in`);
  const { body } = req;
  const response = await AuthService.login(body);

  res.status(httpStatusCode.CREATED).json({
    ...response,
  });
}

export function register(req: Request, res: Response) {
  logger.info(`Creating new user`);
}
