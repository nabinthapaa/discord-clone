import { UUID } from "../types";

export enum EUserType {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface IUser {
  id: UUID;
  userName: string;
  displayName: string | null;
  email: string;
  type: EUserType;
  password: string;
  image: string;
  dateOfBirth: Date;
}

export interface IUserWithoutTypeAndId extends Omit<IUser, "id" | "type"> {}
export interface IUserWithoutId extends Omit<IUser, "id"> {}

export interface IUserWithEmailAndPassword
  extends Pick<IUser, "email" | "password"> {}

export interface IUserWithoutPassword extends Omit<IUser, "password"> {}
