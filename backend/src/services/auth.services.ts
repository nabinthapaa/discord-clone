import { UserService } from ".";
import config from "../config";
import {
  BaseError,
  NotFoundError,
  UnauthentictedError,
  UserExistsError,
} from "../errors";
import {
  IUserWithEmailAndPassword,
  IUserWithoutPassword,
  IUserWithoutTypeAndId,
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
    userName: existingUser.userName,
    image: existingUser.image,
    type: existingUser.type,
    dateOfBirth: existingUser.dateOfBirth,
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

export async function register(
  user: IUserWithoutTypeAndId,
): Promise<{ message: string }> {
  const existingUserWithEmail = await UserService.getUserByEmail(user.email);
  const existingUserWithUsername = await UserService.getUserByUsername(
    user.userName,
  );

  if (existingUserWithEmail) {
    throw new UserExistsError(`${user.email} already in use`);
  } else if (existingUserWithUsername) {
    throw new UserExistsError(`${user.userName} already taken`);
  }

  await UserService.createUser(user);

  return {
    message: "User created Successfully. Please login",
  };
}
