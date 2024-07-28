import express, { NextFunction, Response } from "express";
import authRouter from "./auth.routes";
import channelRouter from "./channel.routes";
import serverRouter from "./server.routes";
import { authenticate, cookieChecker } from "../middlewares";
import { UUID } from "../types";
import { Request } from "../interfaces";
import { ChannelService } from "../services";
import { httpStatusCode, requestWrapper } from "../utils";

const router = express();

router.get(
  "/info/:serverId",
  cookieChecker,
  authenticate,
  requestWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const serverId = req.params.serverId as UUID;

    const { id } = req.user!;

    const data = await ChannelService.getUserPermssion(serverId, id);

    return res.status(httpStatusCode.OK).json({
      data,
    });
  }),
);

router.use("/", authRouter);
router.use("/servers", serverRouter);
router.use("/channels", channelRouter);

export default router;
