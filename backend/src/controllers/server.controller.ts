import { Response } from "express";
import { Request } from "../interfaces";
import { ServerService, UserService } from "../services";
import {
  INewServer,
  ISeverParams,
  ISeverParamsWithOutUser,
  ISeverParamsWithUserOnly,
} from "../interfaces/sever.interface";
import { BadRequestError } from "../errors/BadRequestError";

export function createServer(
  req: Request<any, any, INewServer>,
  res: Response,
) {
  const { body, file } = req;
  if (!req.user) throw new BadRequestError(`User not found`);
  const {
    user: { id },
  } = req;
  return ServerService.createServer(body.serverName, file?.filename, id);
}

export function getAllServerOfUser(
  req: Request<ISeverParamsWithUserOnly>,
  res: Response,
) {
  const { userId } = req.params;

  return ServerService.getAllUserServer(userId);
}

export function getAllUsers(
  req: Request<ISeverParamsWithOutUser>,
  res: Response,
) {
  const { id } = req.params;

  return ServerService.getAllSeverMembers(id);
}

export function getServerById(
  req: Request<ISeverParamsWithOutUser>,
  res: Response,
) {
  const { id } = req.params;

  return ServerService.getServerById(id);
}

export function addUserToSever(req: Request<ISeverParams>, res: Response) {
  const { id, userId } = req.params;

  return ServerService.addUserToServer(id, userId);
}

export function removeUserFromServer(
  req: Request<ISeverParams>,
  res: Response,
) {
  const { id, userId } = req.params;

  return ServerService.removeUserFromServer(id, userId);
}
