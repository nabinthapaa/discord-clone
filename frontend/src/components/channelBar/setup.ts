import { getServerChannels } from "../../services/server.service";
import { serverStateStore } from "../../store/serverStateStore";
import { UUID } from "../../types";
import { channelNamse } from "./channelbar.component";

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
      const channelBar = channelNamse(channel as Record<string, any>);
      const channelExists = channelBarContainer.querySelector(
        `[data-id='${channel.id}']`,
      );
      if (!channelExists) {
        if (channel.channelType === "text") {
          textChannelGroup.appendChild(channelBar);
          channelBar.onclick = () => {
            serverStateStore.getState().updateChannels(channel.id);
          };
        }
        if (channel.channelType === "voice")
          voiceChannelGroup.appendChild(channelBar);
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
        serverStateStore.getState().updateChannels(firstTextChannel.id);
      }
  }
}
