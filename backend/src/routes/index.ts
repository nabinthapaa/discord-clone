import express from "express";
import authRouter from "./auth.routes";
import path from "node:path";
import { cookieChecker } from "../middlewares/cookie";
import config from "../config";

const router = express();

// TODO: Remove later
router.use("/index", cookieChecker, (req, res) => {
  console.log("Hello World");
  res.cookie("name", "nishangay", {
    httpOnly: true,
    sameSite: "strict",
    maxAge: config.jwt.accessExpiresIn,
  });
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

router.use("/", authRouter);

export default router;
