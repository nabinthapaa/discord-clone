import Joi from "joi";

// Define the validation schema with custom error messages
const createChannelMessageSchema = Joi.object({
  channelId: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "string.base": "Channel ID must be a string",
    "string.guid": "Channel ID must be a valid UUID",
    "any.required": "Channel ID is required",
  }),
  message: Joi.string().required().messages({
    "string.base": "Message must be a string",
    "any.required": "Message is required",
  }),
  userId: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "string.base": "User ID must be a string",
    "string.guid": "User ID must be a valid UUID",
    "any.required": "User ID is required",
  }),
  serverId: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "string.base": "Server ID must be a string",
    "string.guid": "Server ID must be a valid UUID",
    "any.required": "Server ID is required",
  }),
}).options({
  stripUnknown: true,
});

export function validateMessage(data: any) {
  const { error, value } = createChannelMessageSchema.validate(data);
  if (error) {
    throw new Error(error.message);
  }
  return value;
}
