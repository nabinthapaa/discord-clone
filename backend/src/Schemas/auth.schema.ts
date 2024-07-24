import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email name is require",
    "string.email": "Email must be in a valid format",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
}).options({
  stripUnknown: true,
});

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email name is require",
    "string.email": "Email must be in a valid format",
  }),
  password: Joi.string()
    .required()
    .min(8)
    .messages({
      "any.required": "Password is required",
      "string.min": "Password must be atleast 8 character",
      "password.uppercase": "Password must contain a uppercase letter",
      "password.lowercase": "Password must contain a lowercase letter",
      "password.number": "Password must contain a number",
      "password.special": "Password must contain a special character",
    })
    .custom((value, helpers) => {
      if (!/[A-Z]/.test(value)) {
        return helpers.error("password.uppercase");
      } else if (!/[a-z]/.test(value)) {
        return helpers.error("password.lowercase");
      } else if (!/[0-9]/.test(value)) {
        return helpers.error("password.number");
      } else if (!/[!@#$%]/.test(value)) {
        return helpers.error("password.special");
      }
      return value;
    }),
  userName: Joi.string()
    .required()
    .regex(/^[a-z][a-z0-9_]*$/)
    .messages({
      "any.required": "Username is required",
      "string.pattern.base":
        "Username must start with a letter and can contain only lowercase letters, numbers, and underscores",
    }),
  displayName: Joi.string()
    .optional()
    .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/)
    .messages({
      "string.pattern.base":
        "Display Name must start with letter and can only containe letters, numbers and underscore",
    }),
  dateOfBirth: Joi.date().required().messages({
    "any.required": "Date of birth is required",
  }),
}).options({
  stripUnknown: true,
});
