import { EChanneType, EServerRole } from "../enums";
import { UUID } from "../types";

export interface IChannel {
  serverId: UUID;
  channelName: string;
  channelType: EChanneType;
  channelPermission: EServerRole;
  createdBy: UUID;
}
