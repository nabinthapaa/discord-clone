import { Toast } from "../../enums/toast";
import { socket } from "../../main";
import { getChannelMessage } from "../../services/message.service";
import { authStore } from "../../store/authStore";
import { serverStateStore } from "../../store/serverStateStore";
import { UUID } from "../../types";
import { showToast } from "../../utils/showToast";
import { message } from "./message.component";

export function setupMessage(messageContainer: HTMLDivElement) {
  const messageForm =
    messageContainer.querySelector<HTMLFormElement>("#message-form")!;
  const messages = messageContainer.querySelector<HTMLDivElement>(
    "#message-box-content",
  )!;
  serverStateStore.getState().updateMessageContainer(messages);

  serverStateStore.subscribe(async (newState, prevState) => {
    if (newState.activeChannelId !== prevState.activeChannelId) {
      console.log(
        "Channel Id changed",
        newState.activeChannelId,
        prevState.activeChannelId,
      );
      newState.messageContainer!.innerHTML = "";
      if (newState.activeChannelId) {
        socket.emit("joinChannel", {
          id: newState.activeChannelId,
        });
        await fetchChannelMessage(newState.activeChannelId);
      }
    }
  });

  messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(messageForm);
    socket.emit("message", {
      channelId: serverStateStore.getState().activeChannelId,
      message: formData.get("message"),
      userId: authStore.getState().userData?.id,
      serverId: serverStateStore.getState().activeServerId,
    });
  });

  socket.on("message-response", (data) => {
    messageForm.querySelector<HTMLInputElement>("#message-input")!.value = "";
    const { displayName, userName } = authStore.getState().userData!;
    const messageComponent = message({
      displayName: displayName || userName,
      time: new Date().toLocaleString(),
      message: data.message,
    });
    messages?.appendChild(messageComponent);
    messageComponent.scrollIntoView({
      behavior: "smooth",
    });
  });

  socket.on("message-error", (data) => {
    showToast(data.error, Toast.ERROR);
  });
}

async function fetchChannelMessage(id: UUID) {
  const messages = await getChannelMessage(id);
  if (messages) {
    messages.data.reverse().forEach((data) => {
      const messages = document.querySelector("#message-box-content");
      const messageComponent = message({
        displayName: data.senderName || data.userName,
        time: new Date(data.sentOn).toLocaleString(),
        message: data.message,
      });
      messages?.appendChild(messageComponent);
      messageComponent.scrollIntoView({
        behavior: "smooth",
      });
    });
  }
}
