import express from "express";
import { AuthController } from "../controllers";
import {
  validateLoginData,
  validateRegistrationData,
} from "../middlewares/validateAuthData";
import { loginSchema, registerSchema } from "../Schemas/auth.schema";
import { requestWrapper } from "../utils";

const router = express.Router();

router.post(
  "/login",
  validateLoginData(loginSchema),
  requestWrapper(AuthController.login),
);
router.post(
  "/register",
  validateRegistrationData(registerSchema),
  requestWrapper(AuthController.register),
);

export default router;
