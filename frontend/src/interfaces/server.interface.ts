import { UUID } from "../types";

export interface IServerData {
  ownerName: string;
  memberName: string;
  serverId: string;
  serverName: string;
  serverPicture: string;
}

export interface IChannelData extends Record<string, any> {
  id: UUID;
  serverId: UUID;
  channelName: string;
  channelType: "text" | "voice";
}
