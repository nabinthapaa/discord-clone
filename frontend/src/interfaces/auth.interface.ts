import { z } from "zod";
import { loginSchema, registerSchema } from "../schemas/auth.schema";

export interface ILogin extends z.infer<typeof loginSchema> {}
export interface IRegister extends z.infer<typeof registerSchema> {}

export interface IloginResponse {
  message: string;
  data: {
    accessToken: string;
    refresh: string;
    payload: {
      id: string;
      email: string;
      displayName: string | null;
      userName: string;
      type: "admin" | "user";
      dateOfBirth: string;
    };
  };
}
