import cookie from "cookie";
import { Socket } from "socket.io";
import { MessageService } from "../services";
import { validateMessage } from "./middlewares/validateMessage";
import { extractPayload } from "../utils/getTokenPayload";
import { IUserWithoutPassword } from "../interfaces";

export const messageSocket = (socket: Socket) => {
  let currentRoom: string | null = null;

  socket.on("message", async (data) => {
    if (currentRoom) {
      try {
        validateMessage(data);
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
        if (e instanceof Error) {
          socket.emit("message-error", {
            error: e.message || "Error setting up message",
          });
        }
      }
    } else {
      console.log("User is not in any room.");
    }
  });

  socket.on("update-message", async (data) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      const payload = (await extractPayload(
        cookies.accessToken,
      )) as IUserWithoutPassword;

      const updatedMessage = await MessageService.editChannelMessage({
        ...data,
        senderId: payload.id,
      });

      socket.emit("updated-message", {
        message: updatedMessage.content,
        messageId: data.messageId,
      });
    } catch (e) {
      if (e instanceof Error) {
        socket.emit("message-error", {
          message: e.message,
        });
      }
    }
  });

  socket.on("delete-message", async (data) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      const payload = (await extractPayload(
        cookies.accessToken,
      )) as IUserWithoutPassword;

      await MessageService.deleteChannelMessage(data.messageId, payload.id);

      socket.emit("deleted-message", {
        messageId: data.messageId,
      });
    } catch (e) {
      if (e instanceof Error) {
        socket.emit("message-error", {
          message: e.message,
        });
      }
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
