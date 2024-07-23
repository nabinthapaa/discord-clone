import { IUser } from "../interfaces/user.interface";
import { UserModel } from "../models";
import { UUID } from "../types";

export function getUserByEmail(email: string): Promise<IUser> {
  return UserModel.getUserByEmail(email);
}
