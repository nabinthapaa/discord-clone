import { z } from "zod";

// Create a custom Zod schema for FormData
export const formDataSchema = z.instanceof(FormData).refine(
  (data) => {
    const serverImage = data.get("serverImage");
    const serverName = data.get("serverName");
    return (
      serverImage instanceof File &&
      serverImage.size > 0 &&
      typeof serverName === "string" &&
      serverName.trim().length > 0
    );
  },
  {
    message:
      "FormData must contain a file with the key 'serverImage' and a non-empty 'serverName' field",
  },
);

//

// export const formDataSchema = z.instanceof(FormData).refine( (data) => {
//   serverImage: z.instanceof(FormData).refine(
//     (data) => {
//       const serverImage = data.get("serverImage");
//       return serverImage instanceof File && serverImage.size > 0;
//     },
//     {
//       message: "Must contain a server image",
//     },
//   ),
//   serverName: z.instanceof(FormData).refine(
//     (data) => {
//       const serverName = data.get("serverName");
//       return typeof serverName === "string" && serverName.length > 0;
//     },
//     {
//       message: "Sever Name cannot be empty",
//     },
//   ),
// });
export type IServerFormData = z.infer<typeof formDataSchema>;
