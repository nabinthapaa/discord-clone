import { socket } from "../main";

socket.on("connect", () => {
  console.log("connected");
});
