import Joi from "joi";

export const serverCreationSchema = Joi.object({
  serverName: Joi.string().required().messages({
    "any.required": "Server name cannot be empty",
  }),
}).options({
  stripUnknown: true,
});

export const serverOperationWithUserSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    "any.required": "Server id is required",
  }),
  userId: Joi.string().uuid().required().messages({
    "any.required": "Server id is required",
  }),
}).options({
  stripUnknown: true,
});

export const serverOperationWithoutUserSchema = Joi.object({
  id: serverOperationWithUserSchema.extract("id"),
}).options({
  stripUnknown: true,
});

export const serverOperationWithUserOnlySchema = Joi.object({
  userId: serverOperationWithUserSchema.extract("userId"),
}).options({
  stripUnknown: true,
});
