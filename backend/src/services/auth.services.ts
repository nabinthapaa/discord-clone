import { UserService } from ".";
import config from "../config";
import { BaseError, NotFoundError, UnauthentictedError } from "../errors";
import {
  IUserWithEmailAndPassword,
  IUserWithoutPassword,
} from "../interfaces/user.interface";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function login(data: IUserWithEmailAndPassword) {
  const existingUser = await UserService.getUserByEmail(data.email);

  if (!existingUser) {
    throw new NotFoundError(`User with email: ${data.email} not found`);
  }

  const isValidPassword = bcrypt.compare(data.password, existingUser.password);

  if (!isValidPassword) {
    throw new UnauthentictedError(`Invalid password`);
  }

  const payload: IUserWithoutPassword = {
    id: existingUser.id,
    email: existingUser.email,
    displayName: existingUser.displayName,
    username: existingUser.username,
    image: existingUser.image,
    type: existingUser.type,
  };

  if (!config.jwt.secret) {
    throw new BaseError();
  }

  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiresIn,
  });

  const refreshToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });

  return {
    accessToken,
    refreshToken,
  };
}

export function register() {}
