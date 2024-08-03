import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import http from "node:http";
import path from "node:path";
import config from "./config";
import {
  genericErrorHandler,
  requestLogger,
  routeNotFound,
} from "./middlewares";
import router from "./routes";
import { socketServer } from "./sockets/socket.server";
import { createPeerServer } from "./mediaServers/peerServers";

export const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.1.129:5173",
  "http://172.18.0.3:5173",
];

const app = express();
const server = http.createServer(app);
socketServer(server);
const peerServer = createPeerServer(server);

server.listen(config.port, () => {
  console.log("listening on port 8000");
});

app.use(express.json());
app.use(
  cors({
    origin(requestOrigin, callback) {
      console.log(requestOrigin);
      if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
        callback(null, requestOrigin);
      } else {
        callback(new Error("Not allowed"));
      }
    },
    credentials: true,
  }),
);
app.use(express.static(path.join(__dirname, "../public")));
app.use(cookieParser());
app.use(requestLogger);
app.use("/peerjs", peerServer);
app.use(router);
app.use(routeNotFound);
app.use(genericErrorHandler);
