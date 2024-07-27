import bcrypt from "bcryptjs";
import { EUserType } from "../enums";
import { NotFoundError } from "../errors";
import {
  IUser,
  IUserWithoutId,
  IUserWithoutPassword,
  IUserWithoutTypeAndId,
} from "../interfaces";
import { UserModel } from "../models";
import { UUID } from "../types";

export function getUserByEmail(email: string): Promise<IUser | undefined> {
  return UserModel.getUserByEmail(email);
}

export function getUserByUsername(
  username: string,
): Promise<IUserWithoutPassword | undefined> {
  return UserModel.getUserByUsername(username);
}

export function getUserById(
  id: UUID,
): Promise<IUserWithoutPassword | undefined> {
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
  if (!existingCredentials) {
    throw new NotFoundError(`User with email: ${user.email} not found`);
  }
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
