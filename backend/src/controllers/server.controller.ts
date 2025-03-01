import { Response } from "express";
import { BadRequestError } from "../errors";
import {
  IInvitation,
  INewServer,
  ISeverParams,
  ISeverParamsWithOutUser,
  ISeverParamsWithUserOnly,
  Request,
} from "../interfaces";
import { ChannelService, ServerService } from "../services";
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
    data: [],
  });
}

export async function getAllServerOfUser(
  req: Request<ISeverParamsWithUserOnly>,
  res: Response,
) {
  const { userId } = req.params;

  const userServers = await ServerService.getAllUserServer(userId);

  return res.status(httpStatusCode.OK).json({
    message: "Retrieved all server for user",
    data: userServers,
  });
}

export async function getAllUsers(
  req: Request<ISeverParamsWithOutUser>,
  res: Response,
) {
  const { id } = req.params;

  const users = await ServerService.getAllSeverMembers(id);

  return res.status(httpStatusCode.OK).json({
    message: "Retrieved all user of server",
    data: users,
  });
}

export async function getServerById(
  req: Request<ISeverParamsWithOutUser>,
  res: Response,
) {
  const { id: userId } = req.user!;
  const { id } = req.params;

  const server = await ServerService.getServerById(id);
  const serverRole = await ChannelService.getUserPermssion(id, userId);
  console.log(serverRole);

  return res.status(httpStatusCode.OK).json({
    data: server,
  });
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

export async function removeUserFromServer(
  req: Request<ISeverParams>,
  res: Response,
) {
  const { id, userId } = req.params;

  await ServerService.removeUserFromServer(id, userId);

  return res
    .status(httpStatusCode.OK)
    .json({ message: "User removed successfully" });
}

export async function deleteServer(req: Request<ISeverParams>, res: Response) {
  const { id } = req.params;
  if (!req.user) throw new BadRequestError("User can not be processed");
  const { id: userId } = req.user;

  await ServerService.deleteServer(id, userId);

  res.status(httpStatusCode.OK).json({ message: "server delete successfully" });
}

export async function addFromInvitation(
  req: Request<IInvitation>,
  res: Response,
) {
  const { code } = req.params;
  const { id } = req.user!;

  await ServerService.addUserFromInvitaionCode(code, id);

  res.status(httpStatusCode.OK).json({ message: "Join successfully" });
}
