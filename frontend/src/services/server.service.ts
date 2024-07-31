import { SERVER_BASE_URL } from "../constants/requestUrls/serverFetch";
import { HttpMethod } from "../enums/method";
import { Toast } from "../enums/toast";
import { IServerData } from "../interfaces/server.interface";
import { IServerFormData } from "../schemas/server.schema";
import { UUID } from "../types";
import { requestToServer } from "../utils/requestHandler";
import { showToast } from "../utils/showToast";

export async function getAllServers(userId: UUID) {
  const servers = await requestToServer<IServerData[]>(
    `${SERVER_BASE_URL}/users/${userId}`,
    {
      method: HttpMethod.GET,
    },
    (data) => data,
  );

  console.log(servers);
  return servers;
}

export async function createSever(serverData: IServerFormData) {
  return await requestToServer<IServerData[]>(
    `${SERVER_BASE_URL}`,
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

export async function getServerInfo(serverId: UUID) {
  return await requestToServer<IServerData[]>(
    `${SERVER_BASE_URL}/serverId`,
    {
      method: HttpMethod.GET,
    },
    (data) => {
      showToast(data.message, Toast.INFO);
      return data;
    },
  );
}
