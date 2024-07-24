import { UUID } from "../types";

export interface IDirectMessage {
  messageId: UUID;
  user1Name: string;
  user2Name: string;
  message: string;
  sendOn: Date;
  isPinned: boolean;
}

export interface IChannelMessage
  extends Omit<IDirectMessage, "user1Name" | "user2Name"> {
  channelName: string;
  senderName: string;
}

export interface IChannelMessageDB
  extends Omit<IChannelMessage, "senderName" | "channelName" | "serverName"> {}
