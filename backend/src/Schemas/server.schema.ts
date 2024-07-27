import Joi from "joi";

export const serverCreationSchema = Joi.object({
  serverName: Joi.string().required().messages({
    "any.required": "Server name cannot be empty",
  }),
  userId: Joi.string().uuid().required().messages({
    "any.required": "Cannot find server owner",
  }),
}).options({
  stripUnknown: true,
});
