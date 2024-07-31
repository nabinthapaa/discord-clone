import express from "express";
import { AuthController } from "../controllers";
import { AuthSchema } from "../Schemas";
import { requestWrapper } from "../utils";
import { validateRequestBody } from "../middlewares";

const router = express.Router();

router.post(
  "/login",
  validateRequestBody(AuthSchema.loginSchema),
  requestWrapper(AuthController.login),
);
router.post(
  "/register",
  validateRequestBody(AuthSchema.registerSchema),
  requestWrapper(AuthController.register),
);

export default router;
