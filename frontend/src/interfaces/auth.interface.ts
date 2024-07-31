import { z } from "zod";
import { loginSchema, registerSchema } from "../schemas/auth.schema";

export interface ILogin extends z.infer<typeof loginSchema> {}
export interface IRegister extends z.infer<typeof registerSchema> {}

export interface IloginData {
  accessToken: string;
  refreshToken: string;
  payload: IloginPayload;
}

export interface IloginPayload {
  id: string;
  email: string;
  displayName: string | null;
  userName: string;
  type: "admin" | "user";
  dateOfBirth: string;
}
