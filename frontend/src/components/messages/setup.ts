import { socket } from "../../main";
import { message } from "./message.component";

export function setupMessage(messageContainer: HTMLDivElement) {
  const messageForm =
    messageContainer.querySelector<HTMLFormElement>("#message-form")!;
  const messages = messageContainer.querySelector("#message-box-content");

  console.log(messageForm);

  messageForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(messageForm);

    socket.emit("message", {
      message: formData.get("message"),
    });
  });

  socket.on("message-response", (data) => {
    console.log(data);
    const messageComponent = message({
      displayName: "Dev Raj",
      time: new Date().toLocaleString(),
      message: data.message,
    });
    messages?.appendChild(messageComponent);
  });
}
