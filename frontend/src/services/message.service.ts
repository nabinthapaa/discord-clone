import { CHANNEL_MESSAGE_URL } from "../constants/backendRoutes/routes";
import { HttpMethod } from "../enums/method";
import { Toast } from "../enums/toast";
import { IMessageData } from "../interfaces/server.interface";
import { UUID } from "../types";
import { requestToServer } from "../utils/requestHandler";
import { showToast } from "../utils/showToast";

export async function getChannelMessage(channelId: UUID) {
  return await requestToServer<IMessageData[]>(
    CHANNEL_MESSAGE_URL(channelId),
    {
      method: HttpMethod.GET,
    },
    (data) => {
      showToast(data.message, Toast.INFO);
      return data;
    },
  );
}
