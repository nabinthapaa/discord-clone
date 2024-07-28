import bcrypt from "bcryptjs";
import jwt, { sign, verify } from "jsonwebtoken";
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
} from "../interfaces";

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
    payload,
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

export async function refresh(refreshToken: string) {
  let accessToken: string = "";
  /**
   * INFO: Docs say it verifies asynchronously but type definition says otherwise
   * followed docs and added await works fine
   */
  await verify(refreshToken, config.jwt.secret!, async (error, data) => {
    if (error) {
      throw new BaseError(error.message);
    }
    if (typeof data !== "string" && data) {
      const user = await UserService.getUserByEmail(data.email);
      if (!user) throw new NotFoundError("User not found");
      accessToken = sign(user, config.jwt.secret!, {
        expiresIn: config.jwt.accessExpiresIn,
      });
    }
  });

  return accessToken;
}
