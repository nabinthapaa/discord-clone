import { Response } from "express";
import { Request } from "../interfaces";
import { httpStatusCode } from "../utils";
import { IChannel } from "../interfaces/channel.interface";
import { ChannelService } from "../services";
import { UUID } from "../types";

export async function createChannel(
  req: Request<any, any, IChannel>,
  res: Response,
) {
  const { body } = req;
  const { id } = req.user!;

  await ChannelService.createChannel(body, id);

  return res.status(httpStatusCode.CREATED).json({
    message: "Channel created Successfully",
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
    data: channels,
  });
}
