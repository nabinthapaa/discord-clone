import { NextFunction, Response } from "express";
import Joi from "joi";
import { BadRequestError } from "../errors";
import {
  IUserWithEmailAndPassword,
  IUserWithoutTypeAndId,
  Request,
} from "../interfaces";

/**
 * Middleware function to validate request params  using Joi schema.
 *
 * @param {Joi.ObjectSchema} QueryFormat - The Joi schema object to validate the request params against.
 * @throws {BadRequestError} - If request params do not match the specified Joi schema.
 */
export function validateRequestParams(QueryFormat: Joi.ObjectSchema) {
  return (
    req: Request<any, any, IUserWithEmailAndPassword>,
    _: Response,
    next: NextFunction,
  ) => {
    console.log(req.params);
    const { error, value } = QueryFormat.validate(req.params);
    if (error) {
      return next(new BadRequestError(error.message));
    }

    req.params = value;
    next();
  };
}

/**
 * Middleware function to validate request query  using Joi schema.
 *
 * @param {Joi.ObjectSchema} QueryFormat - The Joi schema object to validate the query parameters against.
 * @throws {BadRequestError} - If query parameters do not match the specified Joi schema.
 */
export function validateRequestQuery(QueryFormat: Joi.ObjectSchema) {
  return (
    req: Request<any, any, IUserWithEmailAndPassword>,
    _: Response,
    next: NextFunction,
  ) => {
    const { error, value } = QueryFormat.validate(req.query);
    if (error) {
      return next(new BadRequestError(error.message));
    }

    req.query = value;
    next();
  };
}

/**
 * Middleware function to validate request body using Joi schema.
 *
 * @param {Joi.ObjectSchema} QueryFormat - The Joi schema object to validate the request body against.
 * @throws {BadRequestError} - If request body do not match the specified Joi schema.
 */
export function validateRequestBody(QueryFormat: Joi.ObjectSchema) {
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
    next();
  };
}
