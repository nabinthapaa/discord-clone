import { UUID } from "../types";

export interface IServerData {
  ownerName: string;
  memberName: string;
  serverId: UUID;
  serverName: string;
  serverPicture: string;
}

export interface IChannelData extends Record<string, any> {
  id: UUID;
  serverId: UUID;
  channelName: string;
  channelType: "text" | "voice";
}

export interface IMessageData extends Record<string, any> {
  messageId: UUID;
  message: string;
  sentOn: string;
  channelName: string;
  senderName: string;
  userName: string;
}
