import express from "express";
import authRouter from "./auth.routes";

const router = express();
router.use("/", authRouter);

export default router;
