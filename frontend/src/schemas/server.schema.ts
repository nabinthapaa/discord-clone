import { z } from "zod";

// Create a custom Zod schema for FormData
export const createServerSchema = z
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
export type IServerFormData = z.infer<typeof createServerSchema>;

export const createChannelSchema = z.object({
  channelName: z.string().min(5, "Channel Name must be 5 characters long"),
  channelType: z.enum(["voice", "text"], {
    errorMap: (issue, _ctx) => {
      switch (issue.code) {
        case "invalid_enum_value":
          return { message: "Value should be text or voice" };
        default:
          return { message: "Invalid data provide" };
      }
    },
  }),
});

export type IChannelFormData = z.infer<typeof createChannelSchema>;
