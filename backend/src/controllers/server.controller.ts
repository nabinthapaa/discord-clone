import { Response } from "express";
import { BadRequestError } from "../errors";
import {
  INewServer,
  ISeverParams,
  ISeverParamsWithOutUser,
  ISeverParamsWithUserOnly,
  Request,
} from "../interfaces";
import { ServerService } from "../services";
import { httpStatusCode } from "../utils";

export async function createServer(
  req: Request<any, any, INewServer>,
  res: Response,
) {
  const { body, file } = req;
  if (!req.user) throw new BadRequestError(`User not found`);
  const {
    user: { id },
  } = req;

  await ServerService.createServer(body.serverName, file?.filename, id);
  return res.status(httpStatusCode.CREATED).json({
    message: "Server created successfully",
  });
}

export async function getAllServerOfUser(
  req: Request<ISeverParamsWithUserOnly>,
  res: Response,
) {
  const { userId } = req.params;

  const userServers = await ServerService.getAllUserServer(userId);

  return res.status(httpStatusCode.OK).json({
    data: userServers,
  });
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

export async function addUserToSever(
  req: Request<ISeverParams>,
  res: Response,
) {
  const { id, userId } = req.params;

  await ServerService.addUserToServer(id, userId);

  return res
    .status(httpStatusCode.CREATED)
    .json({ message: "User added successfully" });
}

export function removeUserFromServer(
  req: Request<ISeverParams>,
  res: Response,
) {
  const { id, userId } = req.params;

  return ServerService.removeUserFromServer(id, userId);
}
