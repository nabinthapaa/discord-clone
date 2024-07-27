import express from "express";
import { ServerController } from "../controllers";
import { validateServerData } from "../middlewares";
import { serverCreationSchema } from "../Schemas/server.schema";
import { requestWrapper } from "../utils";
import upload from "../utils/multer";
import { cookieChecker } from "../middlewares/cookie";
import { authenticate } from "../middlewares/authenticate";

const router = express.Router();

// INFO: create server
router.post(
  "/",
  cookieChecker,
  authenticate,
  upload.single("serverImage"),
  validateServerData(serverCreationSchema),
  requestWrapper(ServerController.createServer),
);

// INFO: get all servers of a user
router.get("/users/:userId");

// INFO: get all users from server
router.get("/:id/users");

// INFO: get server by id
router.get("/:id");

// INFO: add user to server
router.post("/:id/users/:userId");

// INFO: remove user from server
router.delete("/:id/users/:userId");

export default router;
