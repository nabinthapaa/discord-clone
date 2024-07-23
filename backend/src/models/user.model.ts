import { IUser, IUserWithoutPassword } from "../interfaces";
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
}
