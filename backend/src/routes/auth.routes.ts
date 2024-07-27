import express from "express";
import { AuthController } from "../controllers";
import { Validator } from "../middlewares";
import { AuthSchema } from "../Schemas";
import { requestWrapper } from "../utils";

const router = express.Router();

router.post(
  "/login",
  Validator.validateLoginData(AuthSchema.loginSchema),
  requestWrapper(AuthController.login),
);
router.post(
  "/register",
  Validator.validateRegistrationData(AuthSchema.registerSchema),
  requestWrapper(AuthController.register),
);

export default router;
