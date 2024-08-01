import { Socket } from "socket.io";
import cookie from "cookie";
import { MessageService } from "../services";

export const messageSocket = (socket: Socket) => {
  // Track the current room of the user
  let currentRoom: string | null = null;

  socket.on("message", async (data) => {
    if (currentRoom) {
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      try {
        const writtenMessage = await MessageService.createChannelMessage(
          data.channelId,
          data.message,
          data.userId,
          data.serverId,
        );
        socket.to(currentRoom).emit("message-response", {
          ...writtenMessage,
        });

        socket.emit("message-response", {
          ...writtenMessage,
        });
      } catch (e) {
        socket.emit("message-error", {
          error: "Error setting up message",
        });
      }
    } else {
      console.log("User is not in any room.");
    }
  });

  socket.on("joinChannel", (data) => {
    // Leave all previous rooms
    let rooms = Array.from(socket.rooms);
    rooms.forEach((room) => {
      if (room !== socket.id) {
        console.log(`User left room ${room}`);
        socket.leave(room);
      }
    });

    // Join the new room
    currentRoom = data.id;
    console.log(`User joined room ${currentRoom}`);
    socket.join(data.id);
  });
};
