import { ExpressPeerServer } from "peer";
import http from "http";
export const createPeerServer = (server: http.Server) => {
  const peerServer = ExpressPeerServer(server, {
    //@ts-ignore
    debug: true,
  });

  return peerServer;
};
