import { NotFoundError } from "../errors";
import { IServer } from "../interfaces/sever.interface";
import { UUID } from "../types";
import { BaseModel } from "./BaseModel";

export class ServerModel extends BaseModel {
  static async createServer(server: IServer) {
    return await ServerModel.queryBuilder().transaction(async (trx) => {
      trx("servers").insert(server);
    });
  }

  static getServerById(id: UUID) {
    return ServerModel.queryBuilder()
      .from("servers as s")
      .where({ id })
      .select(
        "userName as owner",
        "displayName as ownerName",
        "s.id as serverId",
        "serverName",
        "serverPicture",
      )
      .join("users as u", "u.id", "s.userId")
      .first();
  }

  static getAllUserServer(userId: UUID) {
    return ServerModel.queryBuilder()
      .from("servers as s")
      .where({ userId })
      .select(
        "userName as owner",
        "displayName as ownerName",
        "s.id as serverId",
        "serverName",
        "serverPicture",
      )
      .join("users as u", "u.id", "s.userId");
  }

  static async addUserToServer(id: UUID, userId: UUID) {
    return await ServerModel.queryBuilder().transaction(async (trx) => {
      const server = await trx("servers").where({ id }).first();
      if (!server) throw new NotFoundError(`Server not found`);
      const user = await trx("users").where({ id: userId }).first();
      if (!user) throw new NotFoundError(`User not found`);

      await trx("serverMembers").insert({ id, userId });
    });
  }

  static async removeUserFromServer(id: UUID, userId: UUID) {
    return await ServerModel.queryBuilder().transaction(async (trx) => {
      await trx("serverMembers").where({ id, userId }).delete();
    });
  }

  static async getAllServerMember(serverId: UUID) {
    return await ServerModel.queryBuilder()
      .table("serverMembers as sm")
      .where({ serverId })
      .join("users as u", "u.id", "sm.userId")
      .join("servers as s", "s.id", "sm.serverId")
      .select(
        "displayName as memberName",
        "serverName",
        "u.id as memberId",
        "sm.createdAt as joinedOn",
      );
  }
}
