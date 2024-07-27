import express from "express";
import { ServerController } from "../controllers";
import {
  authenticate,
  authorize,
  cookieChecker,
  Validator,
} from "../middlewares";
import { ServerSchema } from "../Schemas";
import { requestWrapper, upload } from "../utils";

const router = express.Router();

// INFO: create server
router.post(
  "/",
  cookieChecker,
  authenticate,
  upload.single("serverImage"),
  Validator.validateServerData(ServerSchema.serverCreationSchema),
  requestWrapper(ServerController.createServer),
);

// INFO: get all servers of a user
router.get(
  "/users/:userId",
  cookieChecker,
  authenticate,
  Validator.validServerQueryParams(
    ServerSchema.serverOperationWithUserOnlySchema,
  ),
  requestWrapper(ServerController.getAllServerOfUser),
);

// INFO: get all users from server
router.get(
  "/:id/users",
  cookieChecker,
  authenticate,
  Validator.validServerQueryParams(
    ServerSchema.serverOperationWithoutUserSchema,
  ),
  requestWrapper(ServerController.getAllUsers),
);

// INFO: get server by id
router.get(
  "/:id",
  cookieChecker,
  authenticate,
  authorize,
  Validator.validServerQueryParams(
    ServerSchema.serverOperationWithoutUserSchema,
  ),
  requestWrapper(ServerController.getServerById),
);

// INFO: add user to server
router.post(
  "/:id/users/:userId",
  cookieChecker,
  authenticate,
  Validator.validServerQueryParams(ServerSchema.serverOperationWithUserSchema),
  requestWrapper(ServerController.addUserToSever),
);

// INFO: remove user from server
router.delete(
  "/:id/users/:userId",
  cookieChecker,
  authenticate,
  Validator.validServerQueryParams(ServerSchema.serverOperationWithUserSchema),
  requestWrapper(ServerController.removeUserFromServer),
);

//TODO: Implement Server delete

export default router;
