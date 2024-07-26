import { UUID } from "../types";

export interface IServer {
  serverName: string;
  serverPicture: string | undefined;
  userId: UUID;
}

export interface INewServer {
  serverName: string;
  serverPicture: string | undefined;
}

export interface ISeverParams {
  id: UUID;
  userId: UUID;
}

export interface ISeverParamsWithOutUser extends Pick<ISeverParams, "id"> {}

export interface ISeverParamsWithUserOnly
  extends Pick<ISeverParams, "userId"> {}

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
