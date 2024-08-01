import {
  CREATE_SERVER_URL,
  GET_CHANNELS_URL,
  GET_USER_SERVERS_URL,
} from "../constants/backendRoutes/routes";
import { HttpMethod } from "../enums/method";
import { Toast } from "../enums/toast";
import { IChannelData, IServerData } from "../interfaces/server.interface";
import { IServerFormData } from "../schemas/server.schema";
import { UUID } from "../types";
import { requestToServer } from "../utils/requestHandler";
import { showToast } from "../utils/showToast";

export async function getAllServers(userId: UUID) {
  const servers = await requestToServer<IServerData[]>(
    GET_USER_SERVERS_URL(userId),
    {
      method: HttpMethod.GET,
    },
    (data) => data,
  );
  return servers;
}

export async function createServer(serverData: IServerFormData) {
  return await requestToServer<IServerData[]>(
    CREATE_SERVER_URL,
    {
      method: HttpMethod.POST,
      headers: {},
      data: serverData,
    },
    (data) => {
      showToast(data.message, Toast.INFO);
      return data;
    },
  );
}

export async function getServerChannels(serverId: UUID) {
  return await requestToServer<IChannelData[]>(
    GET_CHANNELS_URL(serverId),
    {
      method: HttpMethod.GET,
    },
    (data) => {
      showToast(data.message, Toast.INFO);
      return data;
    },
  );
}
