import { z } from "zod";
import { getDate } from "../utils/getDate";

export const loginSchema = z
  .object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  })
  .strip();

export const registerSchema = z
  .object({
    email: z.string().email("Invalid email format"),
    userName: z.string().min(3, "User name must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    displayName: z.string().nullable(),
    dateOfBirth: z
      .date()
      .max(getDate(13), "You must be 13 years old to register"),
  })
  .strip();
