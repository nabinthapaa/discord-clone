import { NextFunction, Response } from "express";
import Joi from "joi";
import { BadRequestError } from "../../errors";
import { Request } from "../../interfaces";

export function validateServerData(QueryFormat: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = QueryFormat.validate(req.body);

    if (error) {
      next(new BadRequestError(error.message));
    }

    req.body = value;
    next();
  };
}

export function validServerQueryParams(QueryFormat: Joi.ObjectSchema) {
  return (req: Request, _: Response, next: NextFunction) => {
    const { error, value } = QueryFormat.validate(req.params);
    if (error) {
      return next(new BadRequestError(error.message));
    }

    req.params = value;
    next();
  };
}
