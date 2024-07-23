import { IUser, IUserWithoutId, IUserWithoutPassword } from "../interfaces";
import { UUID } from "../types";
import { BaseModel } from "./BaseModel";

export class UserModel extends BaseModel {
  static getUserByEmail(email: string): Promise<IUser> {
    return UserModel.queryBuilder()
      .select<IUser>("*")
      .from("users")
      .where({ email });
  }

  static getUserById(id: UUID): Promise<IUserWithoutPassword> {
    return UserModel.queryBuilder()
      .select<IUserWithoutPassword>(
        "username",
        "display_name",
        "type",
        "email",
        "type",
      )
      .from("users")
      .where({ id });
  }

  static getUserByUsername(username: string): Promise<IUserWithoutPassword> {
    return UserModel.queryBuilder()
      .select<IUserWithoutPassword>(
        "username",
        "display_name",
        "type",
        "email",
        "type",
      )
      .from("users")
      .where({ user_name: username });
  }

  static async createUser(user: IUserWithoutId): Promise<void> {
    await UserModel.queryBuilder().transaction(async (trx) => {
      await trx("users").insert({ ...user });
    });
  }

  static async updatePassword(password: string, id: UUID): Promise<void> {
    await UserModel.queryBuilder().transaction(async (trx) => {
      await trx("users").where({ id }).update({ password });
    });
  }

  static async deleteUser(id: UUID): Promise<void> {
    await UserModel.queryBuilder().transaction(async (trx) => {
      await trx("users").where({ id }).delete();
    });
  }
}
