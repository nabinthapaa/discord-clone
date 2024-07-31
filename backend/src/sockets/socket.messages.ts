import { Socket } from "socket.io";

export const messageSocket = (_io: Socket) => {
  _io.on("message", (data) => {
    console.log(data);
    _io.emit("message-response", {
      message: data.message,
    });
  });

  _io.on("joinChannel", (data) => {
    let rooms = Array.from(_io.rooms);

    rooms.forEach((room) => {
      if (room !== data.id) {
        console.log(`User left room ${room}`);
        _io.leave(room);
      }
    });

    console.log(`User joined room ${data.id}`);
    _io.join(data.id);
  });
};
