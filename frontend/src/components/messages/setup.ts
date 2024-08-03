import { Toast } from "../../enums/toast";
import { getChannelMessage } from "../../services/message.service";
import { socket } from "../../sockets";
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
      newState.messageContainer!.innerHTML = "";
      if (newState.activeChannelId) {
        socket.emit("joinChannel", {
          id: newState.activeChannelId,
        });
        await fetchChannelMessage(newState.activeChannelId);
      }
    }
    if (newState.channelName !== prevState.channelName) {
      messageContainer.querySelector("#channelName")!.textContent =
        newState.channelName;
      messageContainer.querySelector<HTMLInputElement>(
        "#message-input",
      )!.placeholder = `Message #${newState.channelName}`;
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
      messageId: data.messageId,
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
    showToast(data.message, Toast.ERROR);
  });

  socket.on("updated-message", (data) => {
    messageContainer.querySelector(`#message-${data.messageId}`)!.textContent =
      data.message;
  });

  socket.on("deleted-message", (data) => {
    const message = messageContainer.querySelector(`#id-${data.messageId}`)!;
    message.parentNode?.removeChild(message);
  });
}

async function fetchChannelMessage(id: UUID) {
  const messages = await getChannelMessage(id);
  if (messages) {
    messages.data.reverse().forEach((data) => {
      const messages = document.querySelector("#message-box-content")!;
      const messageComponent = message({
        messageId: data.messageId,
        displayName: data.senderName || data.userName,
        time: new Date(data.sentOn).toLocaleString(),
        message: data.message,
      });
      messages.appendChild(messageComponent);
      messageComponent.scrollIntoView({
        behavior: "smooth",
      });
      setupEditAndDelete(data.messageId, messageComponent);
    });
  }
}

function setupEditAndDelete(messageId: UUID, messageComponent: HTMLDivElement) {
  const messageEditButton = messageComponent.querySelector<HTMLButtonElement>(
    `#edit-message-${messageId}`,
  )!;
  const actionsMenu = messageComponent.querySelector<HTMLDivElement>(
    `#message-actions-${messageId}`,
  )!;
  const message = messageComponent.querySelector<HTMLParagraphElement>(
    `#message-${messageId}`,
  )!;
  const editForm =
    messageComponent.querySelector<HTMLFormElement>("#edit-message-form")!;

  messageEditButton.onclick = () => {
    actionsMenu.classList.toggle("hidden");

    actionsMenu.querySelector<HTMLDivElement>("#edit-button")!.onclick = () => {
      actionsMenu.classList.toggle("hidden");
      message.classList.toggle("hidden");
      editForm.classList.toggle("hidden");

      editForm.onsubmit = (e) => {
        e.preventDefault();
        socket.emit("update-message", {
          messageId,
          message: new FormData(editForm).get("message"),
        });
        editForm.classList.toggle("hidden");
        message.classList.toggle("hidden");
      };

      editForm.querySelector<HTMLButtonElement>(
        `#cancel-edit-${messageId}`,
      )!.onclick = () => {
        editForm.classList.toggle("hidden");
        message.classList.toggle("hidden");
      };
    };
    actionsMenu.querySelector<HTMLButtonElement>("#delete-button")!.onclick =
      () => {
        socket.emit("delete-message", {
          messageId,
        });
        actionsMenu.classList.toggle("hidden");
      };
  };
}
