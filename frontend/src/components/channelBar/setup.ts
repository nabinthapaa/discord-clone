import { socket } from "../../constants/otherConnections/other";
import { PeerService } from "../../mediaConnections/peer";
import { getServerChannels } from "../../services/server.service";
import { authStore } from "../../store/authStore";
import { serverStateStore } from "../../store/serverStateStore";
import { UUID } from "../../types";
import {
  connectedUser,
  textChannel,
  voiceChannel,
} from "./channelbar.component";

export function setupChannelBar(channelBar: HTMLDivElement) {
  serverStateStore.subscribe((newState, prevState) => {
    if (newState.activeServerId !== prevState.activeServerId) {
      if (newState.activeServerId)
        fetchServerChannels(newState.activeServerId, channelBar);
    }
  });
}

async function fetchServerChannels(
  serverId: UUID,
  channelBarContainer: HTMLDivElement,
) {
  const serverChannel = await getServerChannels(serverId);
  const voiceChannelGroup =
    channelBarContainer.querySelector("#voice-channel")!;
  const textChannelGroup = channelBarContainer.querySelector("#text-channel")!;
  voiceChannelGroup.innerHTML = "";
  textChannelGroup.innerHTML = "";

  if (serverChannel) {
    serverChannel?.data.forEach((channel) => {
      const channelExists = channelBarContainer.querySelector(
        `[data-id='${channel.id}']`,
      );
      if (!channelExists) {
        if (channel.channelType === "text") {
          const channelBar = textChannel(channel as Record<string, any>);
          textChannelGroup.appendChild(channelBar);
          channelBar.onclick = () => {
            serverStateStore
              .getState()
              .updateChannels(channel.id, channel.channelName);
          };
        } else if (channel.channelType === "voice") {
          const channelBar = voiceChannel(channel as Record<string, any>);
          voiceChannelGroup.appendChild(channelBar);
          channelBar.onclick = () => {
            socket.emit("join-voice-room", {
              channelId: channel.id,
              id: authStore.getState().userData!.id,
            });
            const user = channelBar.querySelector(
              `#connected-user-${channel.id}`,
            )!;
            if (
              !user.querySelector(`#user-${authStore.getState().userData!.id}`)
            ) {
              const userChild = connectedUser(
                authStore.getState().userData as Record<string, any>,
              );
              user.append(userChild);
            }
          };
        }
      }
    });

    const firstTextChannel = serverChannel.data.find(
      (channel) => channel.channelType === "text",
    );
    if (firstTextChannel)
      if (
        serverStateStore.getState().activeChannelId !== null ||
        serverStateStore.getState().activeChannelId !==
          firstTextChannel.serverId
      ) {
        serverStateStore
          .getState()
          .updateChannels(firstTextChannel.id, firstTextChannel.channelName);
      }
  }

  socket.on("user-connected", async ({ users, ...otherInfo }) => {
    const localUserid = authStore.getState().userData!.id;
    const peer = new PeerService();
    peer.initializePeer(localUserid);
    await peer.setupAudioStream();
    peer.establishPeerConnections(users);
    otherInfo.userInfo.forEach((info: any) => {
      if (info.id !== localUserid) {
        const user = document.querySelector(
          `#connected-user-${otherInfo.channelId}`,
        )!;
        if (!user.querySelector(`#user-${info.id}`)) {
          const newConnectedUser = connectedUser(info);
          user.append(newConnectedUser);
        }
      }
    });
  });

  socket.on("user-disconnected", async ({ users, ...otherInfo }) => {
    console.log("user user-disconnected");
    const localUserid = authStore.getState().userData!.id;
    const peer = new PeerService();
    peer.initializePeer(localUserid);
    await peer.setupAudioStream();
    peer.establishPeerConnections(users);
    otherInfo.userInfo.forEach((info: any) => {
      if (info.id !== localUserid) {
        const user = document.querySelector(
          `#connected-user-${otherInfo.channelId}`,
        )!;
        user.innerHTML = ``;
        if (!user.querySelector(`#user-${info.id}`)) {
          const newConnectedUser = connectedUser(info);
          user.append(newConnectedUser);
        }
      }
    });
  });
}
