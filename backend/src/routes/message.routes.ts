import express from "express";
import { MessageController, ServerController } from "../controllers";
import {
  authenticate,
  authorize,
  cookieChecker,
  validateRequestParams,
} from "../middlewares";
import { ServerSchema } from "../Schemas";
import { requestWrapper } from "../utils";

const router = express.Router();

//TODO: to validate the message inputs

/**
 * @description Creates server with provided data
 */
router.post(
  "/channel/:channelId",
  cookieChecker,
  authenticate,
  requestWrapper(MessageController.createServerMessage),
);

/**
 * @description fetchs all servers the requested user is in
 */
router.get(
  "/channel/:channelId",
  cookieChecker,
  authenticate,
  requestWrapper(MessageController.getChannelMessages),
);

/**
 * @description fetchs all members of a server
 */
router.get(
  "/:id/users",
  cookieChecker,
  authenticate,
  validateRequestParams(ServerSchema.serverOperationWithoutUserSchema),
  requestWrapper(ServerController.getAllUsers),
);

/**
 * @description fetchs a specific server by id
 */
router.get(
  "/:id",
  cookieChecker,
  authenticate,
  authorize,
  validateRequestParams(ServerSchema.serverOperationWithoutUserSchema),
  requestWrapper(ServerController.getServerById),
);

/**
 * @description deletes a specific server by id
 */
router.delete(
  "/:id",
  cookieChecker,
  authenticate,
  validateRequestParams(ServerSchema.serverOperationWithoutUserSchema),
  requestWrapper(ServerController.deleteServer),
);

/**
 * @description adds a specific user to server as a member
 */
router.post(
  "/:id/users/:userId",
  cookieChecker,
  authenticate,
  validateRequestParams(ServerSchema.serverOperationWithUserSchema),
  requestWrapper(ServerController.addUserToSever),
);

/**
 * @description removes a specific user from  server
 */
router.delete(
  "/:id/users/:userId",
  cookieChecker,
  authenticate,
  validateRequestParams(ServerSchema.serverOperationWithoutUserSchema),
  requestWrapper(ServerController.removeUserFromServer),
);

export default router;
