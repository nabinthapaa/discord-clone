import { socket } from "../main";

socket.on("connect", () => {
  console.log("connected");
  console.log("Sending hello");
  socket.emit("hello");
});

socket.on("hello", (data) => {
  console.log("Recieved hello response");
  console.log(data);
});
