import { z } from "zod";

// Create a custom Zod schema for FormData
export const formDataSchema = z
  .instanceof(FormData)
  .refine(
    (data) => {
      const serverImage = data.get("serverImage");
      return serverImage instanceof File && serverImage.size > 0;
    },
    {
      message: "Must contain a server image",
      path: ["serverImage"],
    },
  )
  .refine(
    (data) => {
      const serverName = data.get("serverName");
      return typeof serverName === "string" && serverName.length > 0;
    },
    {
      message: "Server Name cannot be empty",
      path: ["serverName"],
    },
  );
export type IServerFormData = z.infer<typeof formDataSchema>;
