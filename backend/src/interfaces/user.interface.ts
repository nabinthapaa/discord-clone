import { UUID } from "../types";

export enum EUserType {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface IUser {
  id: UUID;
  username: string;
  displayName: string | null;
  email: string;
  type: EUserType;
  password: string;
  image: string;
}

export interface IUserWithoutTypeAndId extends Omit<IUser, "id" | "type"> {}
export interface IUserWithoutId extends Omit<IUser, "id"> {}

export interface IUserWithEmailAndPassword
  extends Pick<IUser, "email" | "password"> {}

export interface IUserWithoutPassword extends Omit<IUser, "password"> {}
