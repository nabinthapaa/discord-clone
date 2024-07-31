import { Socket } from "socket.io";

export const messageSocket = (_io: Socket) => {
  _io.on("message", (socket) => {
    _io.emit("message-response", {
      message: "this response to your message",
    });
  });
};
