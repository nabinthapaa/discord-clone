import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import path from "node:path";
import config from "./config";
import {
  genericErrorHandler,
  requestLogger,
  routeNotFound,
} from "./middlewares";
import router from "./routes";

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use(cookieParser());
app.use(requestLogger);
app.use(router);
app.use(routeNotFound);
app.use(genericErrorHandler);

app.listen(config.port, () => {
  console.log("listening on port 8000");
});
