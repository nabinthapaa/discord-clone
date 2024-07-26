import { UUID } from "../types";

export interface IServer {
  serverName: string;
  serverPicture: string | null;
  userId: UUID;
}

export interface IServerMember {
  memberName: string;
  serverName: string;
  memberId: UUID;
  joinedOn: Date;
}

export interface IUserSever {
  ownerName: string;
  memeberName: string;
  serverId: UUID;
  serverName: string;
  serverPicture: string | null;
}

export interface IServerRetrieved {
  owner: string;
  ownerName: string;
  serverId: UUID;
  serverName: string;
  serverPicture: string | null;
}
