import express from "express";
import {
  authenticate,
  cookieChecker,
  validateRequestBody,
  validateRequestParams,
} from "../middlewares";
import {
  channelCreationSchema,
  channelOfServerOperationSchema,
  channelOperationSchema,
} from "../Schemas/channel.schema";
import { requestWrapper, upload } from "../utils";
import { ChannelController } from "../controllers";

const router = express.Router();

// create channel in channels of a sever
router.post(
  "/server/:serverId",
  cookieChecker,
  authenticate,
  upload.none(),
  validateRequestParams(channelOfServerOperationSchema),
  validateRequestBody(channelCreationSchema),
  requestWrapper(ChannelController.createChannel),
);

// get channels of server
router.get(
  "/server/:serverId",
  cookieChecker,
  authenticate,
  validateRequestParams(channelOfServerOperationSchema),
  requestWrapper(ChannelController.getServerChannel),
);

// delete a channel
router.delete(
  "/:id",
  cookieChecker,
  authenticate,
  validateRequestParams(channelOperationSchema),
  requestWrapper(ChannelController.deleteChannel),
);
export default router;
