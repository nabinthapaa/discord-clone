import Joi from "joi";
import { EChanneType, EServerRole } from "../enums";

export const channelCreationSchema = Joi.object({
  serverId: Joi.string().uuid().required().messages({
    "any.required": "Server id is required",
  }),
  channelName: Joi.string().required().messages({
    "any.required": "Channel name is required",
  }),
  channelType: Joi.string()
    .valid(EChanneType.TEXT, EChanneType.VOICE)
    .default(EChanneType.TEXT),
  channelPermission: Joi.string()
    .valid(EServerRole.GUEST, EServerRole.OWNER, EServerRole.MODERATOR)
    .default(EServerRole.GUEST),
}).options({
  stripUnknown: true,
});

export const channelOperationSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    "any.required": "Channel id is required",
  }),
}).options({
  stripUnknown: true,
});

export const channelOfServerOperationSchema = Joi.object({
  serverId: Joi.string().uuid().required().messages({
    "any.required": "Server id is required",
  }),
}).options({
  stripUnknown: true,
});
