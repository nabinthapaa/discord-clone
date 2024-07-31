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

const app = express();
const server = http.createServer(app);
socketServer(server);

server.listen(config.port, () => {
  console.log("listening on port 8000");
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use(cookieParser());
app.use(requestLogger);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(router);
app.use(routeNotFound);
app.use(genericErrorHandler);
