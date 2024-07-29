import zod from "zod";

export const registerSchema = zod.object({
  email: zod.string().email("Invalid email format"),
  userName: zod.string().min(4, "username must be at least 4 characters"),
});
