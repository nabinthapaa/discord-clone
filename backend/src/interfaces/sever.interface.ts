import { UUID } from "../types";

export interface IServer {
  serverName: string;
  serverPicture?: string;
  userId: UUID;
}
