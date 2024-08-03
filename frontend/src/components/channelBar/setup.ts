import { socket } from "../../constants/otherConnections/other";
import { PeerService } from "../../mediaConnections/peer";
import {
  createChannelSchema,
  IChannelFormData,
} from "../../schemas/server.schema";
import {
  createChannel,
  getServerChannels,
} from "../../services/server.service";
import { authStore } from "../../store/authStore";
import { serverStateStore } from "../../store/serverStateStore";
import { UUID } from "../../types";
import { addFormError } from "../../utils/addFormErrors";
import { validate } from "../../utils/validator";
import {
  connectedUser,
  textChannel,
  voiceChannel,
} from "./channelbar.component";

export function setupChannelBar(channelBar: HTMLDivElement) {
  const createChannelModal = document.querySelector("#create-channel-modal");

  const openCreateChannelModal = (e: MouseEvent, type: string) => {
    createChannelModal?.classList.toggle("scale-0");
    createChannelModal?.classList.toggle("animate-pop-up");

    createChannelModal
      ?.querySelector("#close-create-channel-modal")
      ?.addEventListener("click", closeCreateChannelModal);

    const form = createChannelModal?.querySelector<HTMLFormElement>(
      "#create-channel-form",
    )!;
    form.onsubmit = async (e) => {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(form).entries());

      const { errors, success } = validate(createChannelSchema, formData);
      if (errors) {
        addFormError(form, errors);
      } else if (success) {
        await createChannel(formData as IChannelFormData);
        closeCreateChannelModal();
      }
    };
  };

  const closeCreateChannelModal = () => {
    createChannelModal?.classList.add("scale-0");
    createChannelModal?.classList.remove("animate-pop-up");
    createChannelModal
      ?.querySelector("#close-create-channel-modal")
      ?.removeEventListener("click", closeCreateChannelModal);
  };

  const createTextChannelButton = channelBar.querySelector<HTMLButtonElement>(
    "#create-text-channel-button",
  );
  const createVoiceChannelButto = channelBar.querySelector<HTMLButtonElement>(
    "#create-voice-channel-button",
  );

  createTextChannelButton!.onclick = (e) => {
    e.preventDefault();
    openCreateChannelModal(e, "text");
  };

  createVoiceChannelButto!.onclick = (e) => {
    e.preventDefault();
    openCreateChannelModal(e, "voice");
  };

  serverStateStore.subscribe((newState, prevState) => {
    if (newState.activeServerId !== prevState.activeServerId) {
      if (newState.activeServerId)
        fetchServerChannels(newState.activeServerId, channelBar);
    }
  });

  document.addEventListener("click", (e) => {
    if (e.target === createChannelModal) {
      closeCreateChannelModal();
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
