import io from "socket.io";
import http from "node:http";
import { messageSocket } from "./socket.messages";

export const socketServer = (server: http.Server) => {
  const _io = new io.Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });
  _io.on("connect", (socket) => {
    console.log("Client connected to", socket.id);
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    socket.on("hello", (data) => {
      socket.emit("hello-response", {
        pingTimeout: 60000,
        cors: {
          origin: "http://localhost:5173",
          credentials: true,
        },
      });
    });
    messageSocket(socket);
  });

  _io.on("error", (error) => {
    console.error("Socket.IO error:", error);
  });

  return _io;
};
