import express from "express";
import config from "./config";
import path from "node:path";
import router from "./routes";
import { requestLogger } from "./middlewares";

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use(requestLogger);
app.use(router);

app.listen(config.port, () => {
  console.log("listening on port 8000");
});

app.get("/", (req, res) => {
  res.sendFile("index.html");
});
