import express, { Response } from "express";
import config from "../config";
import { Request } from "../interfaces";
import { requestWrapper } from "../utils";
import upload from "../utils/multer";
import { saveImage } from "../utils/saveImage";
import authRouter from "./auth.routes";
import serverRouter from "./server.routes";

const router = express();

// TODO: Remove later
router.post(
  "/",
  upload.single("image"),
  requestWrapper(async (req: Request, res: Response) => {
    const reply = await saveImage(req.file?.filename);
    res
      .status(200)
      .cookie("name", "nishangay", {
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        ...reply,
      });
  }),
);

router.use("/", authRouter);
router.use("/servers", serverRouter);

export default router;
