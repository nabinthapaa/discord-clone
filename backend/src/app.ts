import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import https from "node:https";
import path from "node:path";
import config from "./config";
import { createPeerServer } from "./mediaServers/peerServers";
import {
  authenticateSocketConnection,
  genericErrorHandler,
  requestLogger,
  routeNotFound,
} from "./middlewares";
import router from "./routes";
import { socketServer } from "./sockets/socket.server";
import fs from "node:fs";

export const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.1.129:5173",
  "http://172.18.0.3:5173",
  "https://localhost:5173",
  "https://192.168.1.129:5173",
  "https://172.18.0.3:5173",
];

const certPath = path.resolve(__dirname, "../certificates/cert.pem");
const keyPath = path.resolve(__dirname, "../certificates/key.pem");

// Read the certificate and key files
const options = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
};

const app = express();
const server = https.createServer(options, app);
const socket = socketServer(server);
const peerServer = createPeerServer(server);

socket.use(authenticateSocketConnection);
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

server.listen(config.port, () => {
  console.log("listening on port 8000");
});
