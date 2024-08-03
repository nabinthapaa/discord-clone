import { io } from "socket.io-client";
import { BACKEND_URL } from "../constants/backendRoutes/routes";
import { serverStateStore } from "../store/serverStateStore";

export const socket = io(BACKEND_URL, {
  withCredentials: true,
});

socket.on("connect", () => {
  const chanelId = serverStateStore.getState().activeChannelId;
  if (chanelId) {
    socket.emit("joinChannel", { id: chanelId });
  }
});
