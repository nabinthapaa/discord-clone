import { socket } from "../constants/otherConnections/other";

socket.on("connect", () => {
  console.log("connected");
  console.log("Sending hello");
  socket.emit("hello");
});

socket.on("hello", (data) => {
  console.log("Recieved hello response");
  console.log(data);
});

socket.on("error", (data) => {
  console.error("Socket Error");
  console.log(data);
});
