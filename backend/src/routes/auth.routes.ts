import express from "express";
import { AuthController } from "../controllers";
import { requestWrapper } from "../utils";

const router = express.Router();

router.post("/login", requestWrapper(AuthController.login));
router.post("/register", requestWrapper(AuthController.register));

export default router;
