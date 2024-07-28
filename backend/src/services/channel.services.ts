import { ServerService } from ".";
import { EServerRole } from "../enums";
import { BadRequestError, NotFoundError } from "../errors";
import { IChannel } from "../interfaces/channel.interface";
import { ChannelModel } from "../models";
import { UUID } from "../types";

export async function createChannel(server: IChannel, userId: UUID) {
  const user = await getUserPermssion(server.serverId, userId);
  if (!user) throw new NotFoundError(`Server not found`);

  if (user.serverRole === EServerRole.GUEST || userId !== user.memberId)
    throw new BadRequestError(`Invalid action`);

  console.log(server);

  return ChannelModel.createChannel({ ...server, createdBy: userId });
}

export async function deleteChannel(id: UUID, userId: UUID) {
  const channel = await ChannelModel.getChannelById(id);
  if (!channel) {
    throw new NotFoundError(`Channel with ID ${id} not found`);
  }
  const user = await getUserPermssion(channel.serverId, userId);
  if (!user) {
    throw new NotFoundError(`User with ID ${userId} not found`);
  }

  if (user.serverRole === EServerRole.GUEST || userId !== user.memberId)
    throw new BadRequestError(`Invalid action`);
  return ChannelModel.deleteChannel(id);
}

export function getAllServerChannel(serverId: UUID) {
  return ChannelModel.getAllChannelOfSever(serverId);
}

export async function getUserPermssion(serverId: UUID, userId: UUID) {
  const serverMemebers = await ServerService.getAllSeverMembers(serverId);
  console.log(serverMemebers, userId);
  const user = serverMemebers.find((sm) => sm.memberId === userId);
  if (!user) throw new BadRequestError(`Invalid User`);

  return user;
}
