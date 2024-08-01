import { Response } from "express";
import { IChannelMessage, IChannelMessageParams, Request } from "../interfaces";
import { httpStatusCode } from "../utils";
import { IChannel } from "../interfaces/channel.interface";
import { ChannelService, MessageService } from "../services";
import { UUID } from "../types";

export async function createServerMessage(
  req: Request<IChannelMessageParams, any, IChannelMessage>,
  res: Response,
) {
  const { message } = req.body;
  const { serverId, channelId } = req.params;
  const { id } = req.user!;

  await MessageService.createChannelMessage(channelId, message, id, serverId);

  return res.status(httpStatusCode.CREATED).json({
    message: "Channel created Successfully",
  });
}

export async function getChannelMessages(
  req: Request<IChannelMessageParams, any, IChannelMessage>,
  res: Response,
) {
  const { channelId } = req.params;

  const messages = await MessageService.getChannelMessages(channelId);

  return res.status(httpStatusCode.CREATED).json({
    message: "Messages retrieved",
    data: messages,
  });
}

export async function deleteChannel(req: Request<{ id: UUID }>, res: Response) {
  const { id } = req.params;
  const { id: userId } = req.user!;

  await ChannelService.deleteChannel(id, userId);

  return res
    .status(httpStatusCode.OK)
    .json({ message: "Channel deleted Successfully" });
}

export async function getServerChannel(
  req: Request<Pick<IChannel, "serverId">>,
  res: Response,
) {
  const { serverId } = req.params;

  const channels = await ChannelService.getAllServerChannel(serverId);

  return res.status(httpStatusCode.OK).json({
    message: `Channel retrieved for server ${channels[0].serverName}`,
    data: channels,
  });
}
