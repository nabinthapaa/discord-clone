import Joi from "joi";
import {
  IUserWithEmailAndPassword,
  IUserWithoutTypeAndId,
  Request,
} from "../interfaces";
import { NextFunction, Response } from "express";
import { BadRequestError } from "../errors/BadRequestError";

/**
 * Middleware function to validate request body  using Joi schema.
 *
 * @param {Joi.ObjectSchema} QueryFormat - The Joi schema object to validate the query parameters against.
 * @throws {BadRequestError} - If query parameters do not match the specified Joi schema.
 */
export function validateLoginData(QueryFormat: Joi.ObjectSchema) {
  return (
    req: Request<any, any, IUserWithEmailAndPassword>,
    _: Response,
    next: NextFunction,
  ) => {
    const { error, value } = QueryFormat.validate(req.body);
    if (error) {
      return next(new BadRequestError(error.message));
    }

    req.body = value;
  };
}

/**
 * Middleware function to validate request body using Joi schema.
 *
 * @param {Joi.ObjectSchema} QueryFormat - The Joi schema object to validate the query parameters against.
 * @throws {BadRequestError} - If query parameters do not match the specified Joi schema.
 */
export function validateRegistrationData(QueryFormat: Joi.ObjectSchema) {
  return (
    req: Request<any, any, IUserWithoutTypeAndId>,
    _: Response,
    next: NextFunction,
  ) => {
    const { error, value } = QueryFormat.validate(req.body);
    if (error) {
      return next(new BadRequestError(error.message));
    }

    req.body = value;
  };
}
