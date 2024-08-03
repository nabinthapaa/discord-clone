import { io } from "socket.io-client";
import { BACKEND_URL } from "../backendRoutes/routes";

export const socket = io(BACKEND_URL, {
  withCredentials: true,
});
