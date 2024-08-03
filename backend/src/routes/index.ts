import express, { NextFunction, Response } from "express";
import { Request } from "../interfaces";
import { httpStatusCode, requestWrapper } from "../utils";
import authRouter from "./auth.routes";
import channelRouter from "./channel.routes";
import serverRouter from "./server.routes";
import messageRouter from "./message.routes";

const router = express();

router.get(
  "/health",
  requestWrapper(async (req: Request, res: Response, next: NextFunction) => {
    return res.status(httpStatusCode.OK).json({
      message: "Server listening on port http://localhost:8000",
    });
  }),
);

router.use("/", authRouter);
router.use("/servers", serverRouter);
router.use("/channels", channelRouter);
router.use("/messages", messageRouter);

export default router;
