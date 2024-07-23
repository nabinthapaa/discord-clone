import { NotFoundError } from "../errors";
import {
  EUserType,
  IUser,
  IUserWithoutId,
  IUserWithoutPassword,
  IUserWithoutTypeAndId,
} from "../interfaces/user.interface";
import { UserModel } from "../models";
import { UUID } from "../types";
import bcrypt from "bcryptjs";
import { loggerWithNameSpace } from "../utils";

const logger = loggerWithNameSpace("User Service");

export function getUserByEmail(email: string): Promise<IUser> {
  return UserModel.getUserByEmail(email);
}

export function getUserByUsername(
  username: string,
): Promise<IUserWithoutPassword> {
  return UserModel.getUserByUsername(username);
}

export function getUserById(id: UUID): Promise<IUserWithoutPassword> {
  return UserModel.getUserById(id);
}

export async function createUser(user: IUserWithoutTypeAndId): Promise<void> {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const userToCreate: IUserWithoutId = {
    ...user,
    password: hashedPassword,
    type: EUserType.USER,
  };

  await UserModel.createUser(userToCreate);
}

export async function updatePassword(
  user: IUserWithoutPassword,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const existingCredentials = await UserModel.getUserByEmail(user.email);

  const isValidCurrentPassword = await bcrypt.compare(
    currentPassword,
    existingCredentials.password,
  );
  if (!isValidCurrentPassword) {
    throw new NotFoundError(`Password did not match`);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await UserModel.updatePassword(hashedPassword, user.id);
}
