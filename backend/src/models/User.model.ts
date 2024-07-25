import { IUser, IUserWithoutId, IUserWithoutPassword } from "../interfaces";
import { UUID } from "../types";
import { BaseModel } from "./BaseModel";

export class UserModel extends BaseModel {
  static async getUserByEmail(email: string): Promise<IUser | undefined> {
    return UserModel.queryBuilder()
      .select<IUser>("*")
      .table("users")
      .where("email", email)
      .first();
  }

  static getUserById(id: UUID): Promise<IUserWithoutPassword | undefined> {
    return UserModel.queryBuilder()
      .select<IUserWithoutPassword>(
        "username",
        "displayName",
        "type",
        "email",
        "type",
      )
      .from("users")
      .where({ id })
      .first();
  }

  static getUserByUsername(
    username: string,
  ): Promise<IUserWithoutPassword | undefined> {
    return UserModel.queryBuilder()
      .from("users")
      .where({ user_name: username })
      .select<IUserWithoutPassword>(
        "userName",
        "displayName",
        "type",
        "email",
        "type",
      )
      .first();
  }

  static async createUser(user: IUserWithoutId): Promise<void> {
    await UserModel.queryBuilder().transaction(async (trx) => {
      await trx("users").insert(user);
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
