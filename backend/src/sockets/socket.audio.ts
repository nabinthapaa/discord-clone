import { Socket } from "socket.io";
import { UserService } from "../services";

const channels: Record<string, any> = {};
const userInfo: Record<string, any> = {};

export const audioSocket = (socket: Socket) => {
  // Track the current room of the user

  socket.on("join-voice-room", async (data) => {
    socket.join(data.channelId);
    if (!channels[data.channelId]) {
      channels[data.channelId] = new Set();
    }
    const newUserInfo = {
      userId: data.id,
      socketId: socket.id,
    };

    const user = await UserService.getUserById(data.id);
    userInfo[data.id] = user;

    const userExists = Array.from(channels[data.channelId]).some(
      (e: any) => e.userId === newUserInfo.userId,
    );

    if (!userExists) {
      channels[data.channelId].add(newUserInfo);
    }

    if (channels[data.channelId].size >= 2) {
      socket.emit("user-connected", {
        users: Array.from(channels[data.channelId]),
        channelId: data.channelId,
        userInfo: [userInfo],
      });
    }
  });

  socket.on("left-voice-room", async (data) => {
    try {
      const userInfo = await UserService.getUserById(data.id);
      if (!channels[data.channelId]) {
        return;
      }

      channels[data.channelId] = new Set(
        Array.from(channels[data.channelId]).filter((user: any) => {
          return user.userId !== data.id;
        }),
      );

      if (channels[data.channelId].size > 0) {
        socket.emit("user-disconnected", {
          users: Array.from(channels[data.channelId]),
          channelId: data.channelId,
          userInfo: userInfo,
        });
      } else {
        delete channels[data.channelId];
      }
    } catch (error) {
      console.error("Error handling user disconnection:", error);
    }
  });

  socket.on("disconnect", () => {
    for (const channelId in channels) {
      channels[channelId] = new Set(
        Array.from(channels[channelId]).filter((user: any) => {
          if (user.socketId !== socket.id) {
            return true;
          } else {
            delete userInfo[user.userId];
            return false;
          }
        }),
      );

      // Emit an update to the remaining users in the channel
      if (channels[channelId].size >= 2) {
        socket.emit("user-disconnected", {
          users: Array.from(channels[channelId]),
          channelId: channelId,
          userInfo: userInfo,
        });
      }
    }
  });
};
